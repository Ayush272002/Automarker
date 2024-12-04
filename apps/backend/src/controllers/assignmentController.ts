import prisma from '@repo/db/client';
import {
  AllAssignmentsSchema,
  GetAssignmentSchema,
  UpdateAssignmentSchema,
} from '@repo/zodtypes/user-types';
import { Request, Response } from 'express';
import kafkaClient from '@repo/kafka/client';
import { SUBMIT } from '@repo/topics/topic';

const allAssignments = async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId as string; // Assuming courseId is passed as a query parameter.
    const userId = req.body.userId;

    if (!courseId || !userId) {
      return res.status(400).json({
        message: 'Course ID and User ID are required.',
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        teacher: {
          include: {
            courses: {
              where: { id: courseId },
              select: {
                assignments: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    dueDate: true,
                  },
                },
              },
            },
          },
        },
        student: {
          include: {
            courses: {
              where: { id: courseId },
              select: {
                assignments: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    dueDate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(403).json({
        message: 'User not authorized or course not found.',
      });
    }

    const assignments =
      user.teacher?.courses[0]?.assignments ||
      user.student?.courses[0]?.assignments;

    if (!assignments) {
      return res.status(404).json({
        message: 'No assignments found for this course.',
      });
    }

    return res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getAssignment = async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = req.params.id;
  const parsedData = GetAssignmentSchema.safeParse({ ...body, assignmentId });

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(', '),
    });
  }

  const user = await prisma.user.findFirst({
    include: {
      student: {
        select: {
          courses: {
            select: {
              assignments: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  dueDate: true,
                  createdAt: true,
                  updatedAt: true,
                  maxMarks: true,
                },
                where: {
                  id: parsedData.data.assignmentId,
                },
              },
            },
          },
        },
      },
      teacher: {
        select: {
          courses: {
            select: {
              assignments: {
                where: {
                  id: parsedData.data.assignmentId,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: parsedData.data.userId,
    },
  });

  let assignmentDescription = user?.student?.courses.pop()?.assignments.pop();
  if (!assignmentDescription) {
    assignmentDescription = user?.teacher?.courses.pop()?.assignments.pop();
  }

  if (!assignmentDescription) {
    return res.status(403).json({
      message: 'You do not have access to this assignment.',
    });
  }

  return res.status(200).json({ ...assignmentDescription });
};

const updateAssignment = async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentID = req.params.id;
  const parsedData = UpdateAssignmentSchema.safeParse({
    ...body,
    assignmentId: assignmentID,
  });

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(', '),
    });
  }

  const user = await prisma.user.findFirst({
    select: {
      teacher: {
        select: {
          courses: {
            select: {
              assignments: {
                where: {
                  id: parsedData.data.assignmentId,
                },
              },
            },
          },
        },
      },
    },
    where: {
      id: parsedData.data.userId,
    },
  });

  if (!user?.teacher?.courses[0]?.assignments[0]) {
    return res.status(403).json({
      message:
        'You do not have access to this assignment or you cannot edit the assignment',
    });
  }

  const { userId, assignmentId, ...newAssignmentData } = parsedData.data;

  await prisma.assignment.update({
    where: {
      id: assignmentId,
    },
    data: newAssignmentData,
  });

  return res.status(204).json({
    message: 'Assignment updated successfully.',
  });
};

const createAssignment = async (req: Request, res: Response) => {
  const { title, description, dueDate, maxMarks, courseId, markingScript } =
    req.body;

  if (!title || !dueDate || !maxMarks || !courseId) {
    return res.status(400).json({
      message: 'Title, dueDate, maxMarks, and courseId are required.',
    });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        message: 'Course not found.',
      });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        maxMarks: parseInt(maxMarks, 10),
        courseId,
        markingScript,
      },
    });

    return res.status(201).json({
      message: 'Assignment created successfully.',
      assignment: newAssignment,
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { id: assignmentId } = req.params;
    const { fileUrl } = req.body;
    const userId = req.body.userId;

    if (!assignmentId) {
      return res.status(400).json({ message: 'Assignment ID is required.' });
    }

    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL is required.' });
    }

    const student = await prisma.student.findFirst({
      where: { userId },
      include: {
        courses: {
          include: {
            assignments: {
              where: { id: assignmentId },
            },
          },
        },
      },
    });

    if (!student || !student.courses[0]?.assignments[0]) {
      return res
        .status(403)
        .json({ message: 'Unauthorized or invalid assignment.' });
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId: student.id,
        assignmentZip: fileUrl,
      },
    });

    const kafka = kafkaClient.getInstance();
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: SUBMIT,
      messages: [
        {
          value: JSON.stringify({
            submissionId: submission.id,
            studentId: submission.studentId,
            assignmentId: submission.assignmentId,
            fileUrl: submission.assignmentZip,
            submittedAt: submission.submittedAt,
          }),
        },
      ],
    });
    await producer.disconnect();

    return res
      .status(201)
      .json({ message: 'Assignment submitted successfully.', submission });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export {
  allAssignments,
  getAssignment,
  updateAssignment,
  createAssignment,
  submitAssignment,
};
