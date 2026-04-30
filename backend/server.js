const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = require("./backend/app");

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
  });
}

module.exports = app;
module.exports.handler = serverless(app);