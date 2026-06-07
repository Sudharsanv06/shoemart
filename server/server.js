require("dotenv").config();
const app    = require("./src/app");
const prisma = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const connectWithRetry = async (retries = 10, delay = 5000) => {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ Database connected");
      return true;
    } catch (error) {
      console.log(`⏳ Attempt ${i}/${retries} — Neon waking up... retrying in ${delay/1000}s`);
      if (i === retries) throw error;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const startServer = async () => {
  try {
    // Start server immediately
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Connect DB in background — doesn't block server startup
    await connectWithRetry(10, 5000);

  } catch (error) {
    console.error("❌ Database failed to connect:", error.message);
    // Server still runs — DB will reconnect on next request
  }
};

startServer();

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});