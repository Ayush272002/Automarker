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

router.post('/', authMiddleware, createAssignment);

router.get('/all', authMiddleware, allAssignments);

router
  .route('/:id')
  .get(authMiddleware, getAssignment)
  .patch(authMiddleware, updateAssignment);

router.post('/:id/submit', authMiddleware, submitAssignment);

router.post('/:id/submit', authMiddleware, submitAssignment);

export const assignmentRouter = router;
