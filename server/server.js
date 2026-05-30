require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});
