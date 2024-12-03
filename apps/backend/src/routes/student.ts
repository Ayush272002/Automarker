import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getCourses } from '../controllers/studentController';

const router = Router();

router.get('/courses', authMiddleware, getCourses);

export const studentRouter = router;
