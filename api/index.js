const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs");

let cachedApp;

const createApp = async () => {
  if (cachedApp) return cachedApp;
  
  const express = require("express");
  const app = express();
  
  // Serve static files from frontend build
  const buildPath = path.join(__dirname, "../frontend/build");
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath));
  }
  
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // All other routes serve the React app
  app.get("*", (req, res) => {
    const indexPath = path.join(buildPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Build file not found. Please ensure frontend/build exists.");
    }
  });
  
  cachedApp = app;
  return app;
};

module.exports = async (req, res) => {
  const app = await createApp();
  return serverless(app)(req, res);
};