import { Router } from 'express';
import {
  allAssignments,
  createAssignment,
  getAssignment,
  getSubmissionStatus,
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

router.get('/:id/status', authMiddleware, getSubmissionStatus);

export const assignmentRouter = router;
