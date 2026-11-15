import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';

import { globalErrorHandler } from './shared/middlewares/errorHandler';
import { rateLimiter } from './shared/middlewares/rateLimiter';

dotenv.config();

import authRoutes from './modules/auth/auth.routes';
import activityRoutes from './modules/activity/activity.routes';
import profileRoutes from './modules/profile/profile.routes';
import bumpRoutes from './modules/bump/bump.routes';
import subscriptionRoutes from './modules/subscription/subscription.routes';
import momRoutes from './modules/mom/mom.routes';
import paymentRoutes from './modules/payment/payment.routes';
import adminRoutes from './modules/admin/admin.routes';
import krishnaRoutes from './modules/krishna/krishna.routes';
import supportRoutes from './modules/support/support.routes';
import coursesRoutes from './modules/courses/courses.routes';
import classesRoutes from './modules/classes/classes.routes';
import locationsRoutes from './modules/locations/locations.routes';
import { setupSwagger } from './shared/config/swagger';

const app: Application = express();

// 1. Security & Headers (Allow Razorpay checkout.js & iframe)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(rateLimiter);

// 2. Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static Files (Standard Web Checkout & Admin Dashboard)
app.use(express.static(path.join(__dirname, '../public')));

// 4. Logging
app.use(morgan('combined'));

// 5. Modular Feature Routes
app.use('/api', paymentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/activities', activityRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/bump', bumpRoutes);
app.use('/api/v1/subscription', subscriptionRoutes);
app.use('/api/v1/mom', momRoutes);
app.use('/api/v1/krishna', krishnaRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/courses', coursesRoutes);
app.use('/api/v1/classes', classesRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/v1/locations', locationsRoutes);

// 6. Swagger API Documentation UI (/api-docs)
setupSwagger(app);

// Admin Dashboard UI Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

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
      support: '/api/v1/support',
      courses: '/api/v1/courses',
      classes: '/api/v1/classes',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// 7. Global Error Handler
app.use(globalErrorHandler);

export default app;
