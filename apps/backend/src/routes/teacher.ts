import { Router } from 'express';
import { getDashboard, getStats } from '../controllers/markerController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboard);
router.get('/stats', authMiddleware, getStats);

export const teacherRouter = router;
