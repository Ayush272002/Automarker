import prisma from '@repo/db/client';
import { AllAssignmentsSchema } from '@repo/zodtypes/user-types';
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

export { allAssignments };
