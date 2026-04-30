 const ErrorHandler = require("../utils/ErrorHandler");
 const fs = require("fs");
 const path = require("path");
 
 const __agentDebugLogPathPrimary = path.resolve(__dirname, "..", "..", ".cursor", "debug-24c389.log");
 const __agentDebugLogPathFallback = path.join(process.cwd(), ".cursor", "debug-24c389.log");
 const __agentLog = (payload) => {
    try {
       fs.mkdirSync(path.dirname(__agentDebugLogPathPrimary), { recursive: true });
       fs.appendFileSync(__agentDebugLogPathPrimary, `${JSON.stringify(payload)}\n`, "utf8");
    } catch (_) {}
    try {
       fs.mkdirSync(path.dirname(__agentDebugLogPathFallback), { recursive: true });
       fs.appendFileSync(__agentDebugLogPathFallback, `${JSON.stringify(payload)}\n`, "utf8");
    } catch (_) {}
 };

 module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
 
    // #region agent log
    __agentLog({
       sessionId: "24c389",
       runId: "pre-fix",
       hypothesisId: "H5",
       location: "backend/middleware/error.js",
       message: "ErrorHandler invoked",
       data: {
          statusCode: err.statusCode,
          name: String(err.name || ""),
          message: String(err.message || ""),
          url: String(req.originalUrl || req.url || ""),
          method: String(req.method || ""),
       },
       timestamp: Date.now(),
    });
    // #endregion agent log


    // wrong mongodb id error

    if(err.name === "CastError"){
        const message = `Resource not found.Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    // Duplicate key error

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error

    if(err.name === "JsonWebTokenError"){
        const message = "Json Web Token is invalid. Try again";
        err = new ErrorHandler(message, 400);
    }
    // jwt expire error
    if(err.name === "TokenExpiredError"){
        const message = "Json Web Token is expired. Try again";
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        debugSession: "24c389",
    });
};