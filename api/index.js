/**
 * Vercel Serverless Entry Point
 * Wraps the Express backend as a Vercel serverless function.
 * Ensures DB is connected before handling any request.
 */

const { connectionDatabase } = require("../backend/db/Database");
const app = require("../backend/app");

let dbConnected = false;

module.exports = async (req, res) => {
  // Ensure DB is connected before every request (cached after first connection)
  if (!dbConnected) {
    try {
      await connectionDatabase();
      dbConnected = true;
    } catch (err) {
      console.error("❌ DB Connection failed:", err.message);
      return res.status(500).json({
        success: false,
        message: "Database connection failed. Check DB_URL environment variable.",
        error: err.message,
      });
    }
  }
  // Hand off to the Express app
  return app(req, res);
};