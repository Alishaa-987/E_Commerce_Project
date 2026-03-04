const app = require("./app");

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to uncaugh exception`)
})

// config

if(process.env.NODE_ENV === "PRODUCTION"){
    require("dotenv").config({
        path: "backend/config/.env"
    })
}

// create server

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

// unhandled promise rejection

process.on("unhandledRejection", (err)=>{
    console.log(`Shuttng down the sever for: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)

    server.close(() => {
        process.exit(1); 
    });
})
