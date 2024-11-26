import { Router } from 'express';
import { allAssignments } from '../controllers/assignmentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.route('/all').get(authMiddleware, allAssignments);

export const assignmentRouter = router;
