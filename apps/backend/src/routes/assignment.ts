import { Router } from 'express';
import {
  allAssignments,
  getAssignment,
  submitAssignment,
  updateAssignment,
} from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/all', authMiddleware, allAssignments);

router
  .route('/:id')
  .get(authMiddleware, getAssignment)
  .patch(authMiddleware, updateAssignment);

router.post('/:id/submit', authMiddleware, submitAssignment);

export const assignmentRouter = router;
