import { Router } from "express";
import { createUser, logout, signin } from "../controllers/userController";

const router = Router();

router.post('/signup', createUser);

router.post('/login', signin);

router.post('/logout', logout);

export const userRouter = router;

