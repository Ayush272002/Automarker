import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { studentRouter } from './routes/student';
import { teacherRouter } from './routes/teacher';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user';
import { assignmentRouter } from './routes/assignment';
import client from 'prom-client';
import { metricsMiddleware } from './middlewares/metrics';

dotenv.config();

const app = express();
// Need this while deploying
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(metricsMiddleware);

const PORT = process.env.PORT || 8000;

app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teachers', teacherRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/assignments', assignmentRouter);

app.get('/metrics', async (req: Request, res: Response) => {
  const metrics = await client.register.metrics();
  res.set('Content-Type', client.register.contentType);
  res.end(metrics);
});

//global catch
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.json({
    msg: 'Sorry something is up with our server',
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
