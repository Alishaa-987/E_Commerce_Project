const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload } = require("../multer");
const sendMail = require("../utils/sendMail");
const fs = require("fs");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {isAuthenticated} = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");
// Step 1: Register user and send activation email
router.post("/create-user", upload.single("file"), async (req, res, next) => {

    console.log("📝 [CREATE-USER] Endpoint called");

    try {
        const { name, email, password } = req.body;

        console.log("📋 Signup data received:", { name, email, passwordLength: password?.length });

        // Validate required fields
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please provide name, email and password", 400));
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (req.file) {
                const filename = req.file.filename;
                const filePath = `uploads/${filename}`;
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }
            return next(new ErrorHandler("User with this email already exists", 400));
        }

        const avatar = req.file ? path.join(req.file.filename) : "";

        // Prepare user data for token
        const userData = { name, email, password, avatar };
        
        // Create activation token (expires in 5 minutes)
        const activationToken = createActivationToken(userData);
        const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        try {
            console.log("📧 [EMAIL] Sending activation email to:", email);
            
            // Send activation email
            const mailInfo = await sendMail({
                email: userData.email,
                subject: "Activate Your Account - Lumen Market",
                message: `Hello ${userData.name},\n\nPlease click on the link below to activate your account:\n${activationUrl}\n\nThis link will expire in 5 minutes.\n\nBest regards,\nLumen Market Team`,
            });
            
            console.log("✅ [EMAIL] Activation email sent successfully!");
            console.log("📬 Message ID:", mailInfo.messageId);

            // Return success response WITHOUT creating user yet
            res.status(201).json({
                success: true,
                message: `Activation email has been sent to ${userData.email}. Please check your inbox and click the activation link to complete your registration.`,
            });

        } catch (error) {
            console.error("[EMAIL] Failed to send activation email");
            console.error("Error:", error.message);
            let friendly = "Activation email could not be sent. Please check email settings and try again.";
            if (error?.code === "EAUTH") {
                friendly = "Activation email failed: SMTP credentials were rejected. If using Gmail, turn on 2-Step Verification and use an App Password for SMTP_PASSWORD.";
            }
            return next(new ErrorHandler(friendly, 500));
        }

    } catch (error) {
        console.error("❌ [CREATE-USER] Error:", error);
        next(error);
    }
});

// Step 2: Activate user with token and create account
router.post("/activation", catchAsyncError(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        
        console.log("🔐 [ACTIVATION] Activation endpoint called");

        // Verify the activation token
        let newUser;
        try {
            newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
            console.log("✅ [ACTIVATION] Token verified successfully for:", newUser.email);
        } catch (tokenError) {
            console.error("❌ [ACTIVATION] Invalid or expired token");
            return next(new ErrorHandler("Activation link has expired. Please sign up again.", 400));
        }

        if (!newUser) {
            return next(new ErrorHandler("Invalid activation token", 400));
        }

        const { name, email, password, avatar } = newUser;

        // Check if user already exists (in case token was used twice)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("User already activated or registered", 400));
        }

        // Create the user in database
        const user = await User.create({
            name, 
            email,
            password,
            avatar
        });
        
        console.log("✅ [ACTIVATION] User account created successfully:", email);
        
        // Send JWT token and complete login
        sendToken(user, 201, res);

    } catch (error) {
        console.error("❌ [ACTIVATION] Error:", error.message);
        return next(new ErrorHandler(error.message, 500));
    }
}));

// Helper function to create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m"
    });
};
// login user

router.post("/login-user", catchAsyncError(async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return next(new ErrorHandler("Please provide email and password", 400));
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("User not found with this email", 400));
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return next(new ErrorHandler("Invalid password", 400));
        }
        sendToken(user, 200, res);
    }catch(error){
        next(error);    
    }
}));

// logout user (clears auth cookie)
router.get("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// load user
router.get("/getUser",
     isAuthenticated, 
     catchAsyncError(async (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user,
        });
}));
module.exports = router;
