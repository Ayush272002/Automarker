import { Router } from 'express';
import {
  createUser,
  getAllCourses,
  getUser,
  logout,
  signin,
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/user', authMiddleware, getUser);

router.post('/signup', createUser);

router.post('/login', signin);

router.post('/logout', logout);

router.get('/courses/all', authMiddleware, getAllCourses);

export const userRouter = router;
