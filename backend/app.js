const express = require("express");
const app = express();
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const fileUploaded = require("express-fileupload");


app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUploaded({useTempFiles: true}));

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path: "backend/config/.env"
    })
}
// if for errorHandler 

app.use(ErrorHandler);
module.exports = app;