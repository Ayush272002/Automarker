import { Router } from 'express';
import {
  createUser,
  getAllCourses,
  logout,
  signin,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', createUser);

router.post('/login', signin);

router.post('/logout', logout);

router.get('/courses/all', authMiddleware, getAllCourses);

export const userRouter = router;
