import { Request, Response } from 'express';
import prisma from '@repo/db/client';

const getCourses = async (req: Request, res: Response) => {
  try {
    const studentId = req.body.userId;
    const courses = await prisma.student.findUnique({
      where: { userId: studentId },
      include: {
        courses: true,
      },
    });

    if (!courses) {
      return res
        .status(404)
        .json({ message: 'No courses found for this student' });
    }

    res.status(200).json({ courses: courses.courses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'An error occurred while fetching courses' });
  }
};

export { getCourses };
