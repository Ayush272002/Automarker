import prisma from '@repo/db/client';
import {
  AllAssignmentsSchema,
  GetAssignmentSchema,
  UpdateAssignmentSchema,
} from '@repo/zodtypes/user-types';
import { Request, Response } from 'express';

const allAssignments = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedData = AllAssignmentsSchema.safeParse(body);

    if (!parsedData.success) {
      return res.status(411).json({
        message: parsedData.error.errors.map((err) => err.message).join(', '),
      });
    }

    const user = await prisma.user.findFirst({
      include: {
        student: {
          include: {
            courses: {
              select: {
                id: true,
                assignments: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
        teacher: {
          include: {
            courses: {
              select: {
                id: true,
                assignments: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
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

    if (!user) {
      return res.status(403).json({
        message: 'User not found',
      });
    }

    let course = user.student?.courses.find(
      ({ id }) => id === parsedData.data.courseId
    );
    if (!course) {
      course = user.teacher?.courses.find(
        ({ id }) => id === parsedData.data.courseId
      );
    }

    if (!course) {
      return res.status(403).json({
        message: 'You do not have access to this course.',
      });
    }

    return res.status(200).json({
      assignments: course.assignments,
    });
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

export { allAssignments, getAssignment, updateAssignment };
