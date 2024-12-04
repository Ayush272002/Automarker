import prisma from '@repo/db/client';
import {
  AllAssignmentsSchema,
  GetAssignmentSchema,
  SubmitAssignmentSchema,
  UpdateAssignmentSchema,
} from '@repo/zodtypes/user-types';
import { Request, Response } from 'express';
import kafkaClient from '../../../../packages/kafka/src';
import { SUBMIT } from '@repo/topics/topics';
import { RedisManager } from '../utils/redisManager';

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

const submitAssignment = async (req: Request, res: Response) => {
  const body = req.body;
  const assignmentId = req.params.id;
  const parsedData = SubmitAssignmentSchema.safeParse({
    ...body,
    assignmentId,
  });

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(','),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      id: parsedData.data.userId,
    },
    select: {
      student: {
        select: {
          id: true,
          courses: {
            select: {
              assignments: {
                where: {
                  id: parsedData.data.assignmentId,
                },
                select: {
                  markingScript: true,
                  requiredFiles: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user?.student?.courses[0]?.assignments[0]) {
    return res.status(403).json({
      message:
        'You do not have access to this assignment or you cannot send a submission to this assignment.',
    });
  }

  const assignmentZip = parsedData.data.assignmentZip;
  const payload = {
    markingScript: user.student.courses[0].assignments[0].markingScript,
    requiredFiles: user.student.courses[0].assignments[0].requiredFiles,
    studentId: parsedData.data.userId,
    assignmentId: parsedData.data.assignmentId,
  };

  await prisma.submission.create({
    data: {
      assignmentZip,
      assignment: {
        connect: {
          id: parsedData.data.assignmentId,
        },
      },
      student: {
        connect: {
          id: user.student.id,
        },
      },
      submissionOutbox: {
        create: {
          eventType: 'queued',
          payload: JSON.stringify(payload),
        },
      },
    },
  });

  await kafkaClient.createTopic(SUBMIT);
  const producer = kafkaClient.getInstance().producer();
  await producer.connect();

  producer.send({
    topic: SUBMIT,
    messages: [{ value: JSON.stringify(payload) }],
  });

  await producer.disconnect();

  const redisManager = RedisManager.getInstance();
  let sentResponse = false;
  redisManager.subscribe(SUBMIT, (message) => {
    if (sentResponse) return;

    console.log(message);
  });

  return res.status(200).json({
    message: 'Marking complete.',
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

export { allAssignments, getAssignment, updateAssignment, createAssignment, submitAssignment };
