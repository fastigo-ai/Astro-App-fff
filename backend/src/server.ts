import app from './app';
// import { connectRedis } from './utils/redis';
// import { connectDB } from './utils/db';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Await DB and Redis connections
    // await connectDB();
    // await connectRedis();

    app.listen(PORT, () => {
      console.log(`🚀 API Server running on port ${PORT}`);
      console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
