import { Router } from 'express';
import {
  allAssignments,
  createAssignment,
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

router.post('/', authMiddleware, createAssignment);

router.post('/:id/submit', authMiddleware, submitAssignment);

export const assignmentRouter = router;
