import { Request, Response } from 'express';
import prisma from '@repo/db/client';

const getDashboard = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        courses: {
          include: {
            students: true,
            assignments: {
              include: {
                submissions: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const courses = teacher.courses.map((course) => ({
      id: course.id,
      name: course.name,
      studentCount: course.students.length,
      submitted: course.assignments.reduce(
        (acc, assignment) =>
          acc +
          assignment.submissions.filter((s) => s.marksAchieved >= 0).length,
        0
      ),
      notSubmitted: course.assignments.reduce(
        (acc, assignment) =>
          acc +
          assignment.submissions.filter((s) => s.marksAchieved < 0).length,
        0
      ),
    }));

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

const getStats = async (req: Request, res: Response) => {
  const userId = req.body.userId;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
      include: {
        courses: {
          include: {
            students: true,
            assignments: {
              include: {
                submissions: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const totalCourses = teacher.courses.length;
    const totalStudents = teacher.courses.reduce(
      (acc, course) => acc + course.students.length,
      0
    );
    const totalSubmissions = teacher.courses.reduce(
      (acc, course) =>
        acc +
        course.assignments.reduce(
          (a, assignment) =>
            a +
            assignment.submissions.filter((s) => s.marksAchieved >= 0).length,
          0
        ),
      0
    );
    const pendingReviews = teacher.courses.reduce(
      (acc, course) =>
        acc +
        course.assignments.reduce(
          (a, assignment) =>
            a +
            assignment.submissions.filter((s) => s.marksAchieved < 0).length,
          0
        ),
      0
    );

    res.json({
      totalCourses,
      totalStudents,
      totalSubmissions,
      pendingReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

export { getDashboard, getStats };
