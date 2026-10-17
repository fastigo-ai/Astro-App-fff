import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { globalErrorHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';
// import { requestLogger } from './middlewares/requestLogger';
import swaggerUi from 'swagger-ui-express';
// import swaggerSpec from './utils/swagger';

import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import profileRoutes from './routes/profileRoutes';
import bumpRoutes from './routes/bumpRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import momInteractionsRoutes from './routes/momInteractionsRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app: Application = express();

// 1. Security & Headers (Allow Razorpay checkout.js & iframe)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());

// 2. Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Files (Standard Web Checkout Demo)
app.use(express.static(path.join(__dirname, '../public')));

// 4. Logging
app.use(morgan('combined'));

// 5. Routes
app.use('/api', paymentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/bump', bumpRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/mom', momInteractionsRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Astrobaby API Server is Live & Healthy!',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/v1/auth',
      activities: '/api/v1/activities',
      profile: '/api/v1/profile',
      bump: '/api/v1/bump',
      subscription: '/api/v1/subscription',
      mom: '/api/v1/mom',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// 7. Global Error Handler
app.use(globalErrorHandler);

export default app;
