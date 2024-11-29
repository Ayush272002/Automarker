import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.submissionOutbox.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Test@1234', salt);

  console.log('Seeding started');

  const teacherUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'teacher@example.com',
      password: hashedPassword,
      role: 'TEACHER',
      teacher: {
        create: {},
      },
    },
    include: { teacher: true },
  });

  const studentUser = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'student@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      student: {
        create: {},
      },
    },
    include: { student: true },
  });

  const course = await prisma.course.create({
    data: {
      name: 'Introduction to Programming',
      description: 'Learn the basics of programming.',
      moduleLead: 'John Doe',
      teacherId: teacherUser.teacher!.id,
      students: {
        connect: [{ id: studentUser.student!.id }],
      },
    },
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: 'Assignment 1: Hello World',
      description: 'Write a simple program to print Hello World.',
      dueDate: new Date('2024-12-15'),
      markingScript: '#!/bin/bash\n# Example marking script',
      requiredFiles: 'main.py',
      maxMarks: 100,
      courseId: course.id,
    },
  });

  const submission = await prisma.submission.create({
    data: {
      assignmentZip: 'hello_world.zip',
      marksAchieved: 95,
      logs: 'Compiled successfully',
      assignmentId: assignment.id,
      studentId: studentUser.student!.id,
      submissionOutbox: {
        create: {
          eventType: 'SUBMISSION_CREATED',
          payload: { status: 'Submitted', timestamp: new Date() },
        },
      },
    },
  });

  console.log('Seeded users:');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
