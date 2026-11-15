import 'dotenv/config';
import app from './app';
import { cacheService } from './shared/services/redis.service';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // 1. Connect to Redis (Upstash / Cloud / Local) with fallback
    await cacheService.ensureConnection();

    // 2. Start HTTP listener
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`🚀 API Server running on port ${PORT} (Accessible via LAN)`);
      console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
