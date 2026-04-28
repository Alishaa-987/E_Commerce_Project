// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: `${__dirname}/config/.env`,
    });
}

const http = require("http");
const { Server } = require("socket.io");
const { connectionDatabase } = require("./db/Database");
const app = require("./app");

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    console.log(`Stack: ${err.stack}`);
    if (typeof server !== 'undefined') {
        server.close(() => {
            process.exit(1);
        });
        setTimeout(() => process.exit(1), 1000);
    } else {
        process.exit(1);
    }
});


// connect db
connectionDatabase();

// create server with app
const server = http.createServer(app);

// setup socket.io
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("🔌 Socket disconnected:", socket.id);
    });
});

// Make io accessible to the app
app.set("io", io);

const PORT = 8000; // Force port 8000 for consistency
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)

    server.close(() => {
        process.exit(1);
    });
})
