import { Router } from 'express';
import { allAssignments } from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', authMiddleware, allAssignments);

export const assignmentRouter = router;
