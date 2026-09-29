import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';
// import { requestLogger } from './middlewares/requestLogger';
import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './utils/swagger';

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import profileRoutes from './routes/profileRoutes';
import bumpRoutes from './routes/bumpRoutes';

const app: Application = express();

// 1. Security & Headers
app.use(helmet());
app.use(cors());

// 2. Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging
app.use(morgan('combined'));

// 4. Rate Limiting (Atomic Token Bucket via Redis)
// app.use(rateLimiter); // Disabled temporarily for easy dev testing

// 5. Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/bump', bumpRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// 7. Global Error Handler
app.use(globalErrorHandler);

export default app;
