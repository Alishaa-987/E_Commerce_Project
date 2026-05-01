const express = require("express");
const path = require("path");
const serverless = require("serverless-http");
const app = require("./app");

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/build", "index.html"));
  });
}

// Start the server if run directly (e.g. npm run dev)
if (require.main === module) {
  const { connectionDatabase } = require("./db/Database");
  const PORT = process.env.PORT || 8000;
  connectionDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to DB:", err.message);
      process.exit(1);
    });
}

module.exports = app;
module.exports.handler = serverless(app);