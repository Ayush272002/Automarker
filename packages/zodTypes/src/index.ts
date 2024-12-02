import { z } from 'zod';

export const SignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  role: z.enum(['STUDENT', 'TEACHER']).optional(),
});

export const SigninSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const AllAssignmentsSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid User ID' }),
  courseId: z
    .string({ required_error: 'Course ID is required' })
    .uuid({ message: 'Invalid Course ID' }),
});

export const GetAssignmentSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid User ID' }),
  assignmentId: z
    .string({ required_error: 'Course ID is required' })
    .uuid({ message: 'Invalid Assignment ID' }),
});

export const UpdateAssignmentSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid User ID' }),
  assignmentId: z
    .string({ required_error: 'Course ID is required' })
    .uuid({ message: 'Invalid Assignment ID' }),
  title: z.string().optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  markingScript: z.string().url().optional(),
  requiredFiles: z.string().url().optional(),
  maxMarks: z.number().optional(),
});
