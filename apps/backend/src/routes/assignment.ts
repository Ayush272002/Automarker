import { Router } from 'express';
import {
  allAssignments,
  getAssignment,
  updateAssignment,
} from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', authMiddleware, allAssignments);

router
  .route('/:id')
  .get(authMiddleware, getAssignment)
  .patch(authMiddleware, updateAssignment);

export const assignmentRouter = router;