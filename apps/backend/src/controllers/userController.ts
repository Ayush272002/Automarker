import prisma from '@repo/db/client';
import { SigninSchema, SignupSchema } from '@repo/zodtypes/user-types';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const parsedData = SignupSchema.safeParse(body);

    if (!parsedData.success) {
      return res.status(411).json({
        message: parsedData.error.errors.map((err) => err.message).join(', '),
      });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (userExists) {
      return res.status(403).json({
        message: 'User already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName: parsedData.data.firstName,
          lastName: parsedData.data.lastName,
          email: parsedData.data.email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      await tx.student.create({
        data: {
          userId: user.id,
        },
      });

      return user;
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        message: 'Internal server error: JWT secret is not defined',
      });
    }
    const token = jwt.sign(
      {
        id: result.id,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.cookie('jwt', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const body = req.body;
  const parsedData = SigninSchema.safeParse(body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: parsedData.error.errors.map((err) => err.message).join(', '),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.email,
    },
  });

  if (!user) {
    return res.status(403).json({
      message: 'User not found',
    });
  }

  const isPasswordValid = await bcrypt.compare(
    parsedData.data.password,
    user.password
  );

  if (!isPasswordValid) {
    return res.status(403).json({
      message: 'Invalid credentials',
    });
  }

  const userType = user.role;

  // sign the jwt
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({
      message: 'Internal server error: JWT secret is not defined',
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.cookie('jwt', token, {
    httpOnly: false,
    secure: false,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: 'Logged in successfully',
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Signout error:', error);
    return res.status(500).json({
      message: 'An error occurred during logout',
    });
  }
};

const getAllCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teacher: {
          include: {
            courses: true,
          },
        },
        student: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = [
      ...(user.teacher?.courses || []),
      ...(user.student?.courses || []),
    ];

    const courseDetails = courses.map((course) => ({
      id: course.id,
      name: course.name,
    }));

    return res.status(200).json({ courses: courseDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { createUser, signin, logout, getAllCourses };
