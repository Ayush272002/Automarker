import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { studentRouter } from './routes/student';
import { teacherRouter } from './routes/teacher';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
// Need this while deploying
// const allowedOrigins = process.env.ALLOWED_ORIGINS
//   ? process.env.ALLOWED_ORIGINS.split(',')
//   : [];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teachers', teacherRouter);

//global catch
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.json({
    msg: 'Sorry something is up with our server',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
