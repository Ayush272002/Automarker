import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('Clearing existing data...');
  await prisma.submissionOutbox.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding started...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Test@1234', salt);

  console.log('Creating users...');
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

  const studentUser1 = await prisma.user.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'student1@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      student: {
        create: {},
      },
    },
    include: { student: true },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Brown',
      email: 'student2@example.com',
      password: hashedPassword,
      role: 'STUDENT',
      student: {
        create: {},
      },
    },
    include: { student: true },
  });

  console.log('Creating courses...');
  const course = await prisma.course.create({
    data: {
      name: 'Introduction to Programming',
      description: 'Learn the basics of programming.',
      moduleLead: 'John Doe',
      teacherId: teacherUser.teacher?.id,
      students: {
        connect: [
          { id: studentUser1.student?.id },
          { id: studentUser2.student?.id },
        ],
      },
    },
  });

  console.log('Creating assignments...');
  const assignment1 = await prisma.assignment.create({
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

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'Assignment 2: Simple Calculator',
      description: 'Create a calculator that supports basic operations.',
      dueDate: new Date('2025-01-10'),
      markingScript: '#!/bin/bash\n# Example marking script',
      requiredFiles: 'calculator.py',
      maxMarks: 100,
      courseId: course.id,
    },
  });

  console.log('Creating submissions...');
  await prisma.submission.create({
    data: {
      assignmentZip: 'hello_world.zip',
      marksAchieved: 95,
      logs: 'Compiled successfully',
      assignmentId: assignment1.id,
      studentId: studentUser1.student?.id!,
      submissionOutbox: {
        create: {
          eventType: 'SUBMISSION_CREATED',
          payload: { status: 'Submitted', timestamp: new Date() },
        },
      },
    },
  });

  await prisma.submission.create({
    data: {
      assignmentZip: 'calculator.zip',
      marksAchieved: 88,
      logs: 'Compiled with warnings',
      assignmentId: assignment2.id,
      studentId: studentUser2.student?.id!,
      submissionOutbox: {
        create: {
          eventType: 'SUBMISSION_CREATED',
          payload: { status: 'Submitted', timestamp: new Date() },
        },
      },
    },
  });

  console.log('Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
