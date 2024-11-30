import { Router } from 'express';
import {
  allAssignments,
  getAssignment,
} from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', authMiddleware, allAssignments);

router.route('/:id').get(authMiddleware, getAssignment);

export const assignmentRouter = router;
