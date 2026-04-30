const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { upload, uploadToCloudinary } = require("../multer");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middleware/auth");
const catchAsyncError = require("../middleware/catchAsyncError");

const validAddressTypes = ["Default", "Home", "Office"];

const getVerifiedUser = async (userId, currentPassword) => {
    const password = String(currentPassword || "").trim();

    if (!password) {
        throw new ErrorHandler("Current password is required.", 400);
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ErrorHandler("User not found.", 404);
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ErrorHandler("Current password is incorrect.", 400);
    }

    return user;
};

const getAddressPayload = (payload = {}) => {
    const {
        country,
        countryCode,
        city,
        firstName = "",
        lastName = "",
        phone = "",
        address1,
        address2 = "",
        zipCode,
        addressType = "Home",
    } = payload;

    if (!country || !countryCode || !city || !address1 || !zipCode) {
        throw new ErrorHandler(
            "Country, city, address line 1, and zip code are required.",
            400
        );
    }

    const normalizedType = validAddressTypes.includes(addressType)
        ? addressType
        : "Home";

    return {
        country: String(country).trim(),
        countryCode: String(countryCode).trim().toUpperCase(),
        city: String(city).trim(),
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: String(phone).trim(),
        address1: String(address1).trim(),
        address2: String(address2).trim(),
        zipCode: String(zipCode).trim(),
        addressType: normalizedType,
    };
};
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
            return next(new ErrorHandler("User with this email already exists", 400));
        }

        let avatarUrl = "";
        if (req.file) {
            try {
                avatarUrl = await uploadToCloudinary(req.file.buffer, "avatars");
            } catch (uploadError) {
                console.error("Error uploading avatar:", uploadError);
            }
        }

        // Prepare user data for token
        const userData = { name, email, password, avatar: avatarUrl };
        
        // Create activation token (expires in 5 minutes)
        const activationToken = createActivationToken(userData);
        const activationUrl = `${process.env.CLIENT_URL || "https://schoolhubb.vercel.app"}/activation/${activationToken}`;

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

// get user info
router.get(
  "/user-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(new ErrorHandler("User not found.", 404));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.put(
  "/update-user-info",
    isAuthenticated,
    upload.single("file"),
    catchAsyncError(async (req, res, next) => {
        const name = String(req.body.name || "").trim();
        const email = String(req.body.email || "").trim().toLowerCase();
        const phoneNumber = String(req.body.phoneNumber || "").trim();
        const currentPassword = req.body.currentPassword;

        if (!name || !email) {
            return next(new ErrorHandler("Name and email are required.", 400));
        }

        let user = null;

        try {
            user = await getVerifiedUser(req.user._id, currentPassword);
        } catch (error) {
            return next(error);
        }

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user._id },
        });

        if (existingUser) {
            return next(new ErrorHandler("Email is already in use.", 400));
        }

        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;

        if (req.file) {
            try {
                const avatarUrl = await uploadToCloudinary(req.file.buffer, "avatars");
                user.avatar = avatarUrl;
            } catch (uploadError) {
                console.error("Error uploading avatar:", uploadError);
            }
        }

        await user.save();

        const updatedUser = await User.findById(user._id);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    })
);

router.put(
    "/update-user-password",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const oldPassword = String(req.body.oldPassword || "").trim();
        const newPassword = String(req.body.newPassword || "");
        const confirmPassword = String(req.body.confirmPassword || "");

        if (!newPassword.trim() || !confirmPassword.trim()) {
            return next(new ErrorHandler("New password and confirmation are required.", 400));
        }

        if (newPassword.length < 6) {
            return next(new ErrorHandler("New password must be at least 6 characters.", 400));
        }

        if (newPassword !== confirmPassword) {
            return next(new ErrorHandler("New passwords do not match.", 400));
        }

        if (oldPassword === newPassword) {
            return next(
                new ErrorHandler("New password must be different from the current password.", 400)
            );
        }

        const user = await getVerifiedUser(req.user._id, oldPassword);

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });
    })
);

router.post(
    "/add-address",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next(new ErrorHandler("User not found.", 404));
        }

        const addressPayload = getAddressPayload(req.body);
        const shouldBeDefault =
            addressPayload.addressType === "Default" ||
            !Array.isArray(user.addresses) ||
            user.addresses.length === 0;

        if (addressPayload.addressType === "Default") {
            const existingDefault = user.addresses.find((address) => address.isDefault);

            if (existingDefault) {
                user.addresses.forEach((address) => {
                    address.isDefault = String(address._id) === String(existingDefault._id);
                });

                existingDefault.country = addressPayload.country;
                existingDefault.countryCode = addressPayload.countryCode;
                existingDefault.city = addressPayload.city;
                existingDefault.address1 = addressPayload.address1;
                existingDefault.address2 = addressPayload.address2;
                existingDefault.zipCode = addressPayload.zipCode;
                existingDefault.addressType = addressPayload.addressType;
                existingDefault.isDefault = true;

                await user.save();

                const updatedUser = await User.findById(user._id);

                return res.status(200).json({
                    success: true,
                    message: "Default address replaced successfully.",
                    user: updatedUser,
                });
            }
        }

        if (shouldBeDefault) {
            user.addresses.forEach((address) => {
                address.isDefault = false;
            });
        }

        user.addresses.push({
            ...addressPayload,
            isDefault: shouldBeDefault,
        });

        await user.save();

        const updatedUser = await User.findById(user._id);

        res.status(201).json({
            success: true,
            message: "Address added successfully.",
            user: updatedUser,
        });
    })
);

router.put(
    "/update-address/:addressId",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next(new ErrorHandler("User not found.", 404));
        }

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return next(new ErrorHandler("Address not found.", 404));
        }

        const addressPayload = getAddressPayload(req.body);
        const isOnlyAddress = user.addresses.length === 1;
        const shouldBeDefault = addressPayload.addressType === "Default" || isOnlyAddress;

        if (shouldBeDefault) {
            user.addresses.forEach((item) => {
                item.isDefault = String(item._id) === String(address._id);
            });
        } else if (address.isDefault) {
            const nextDefault = user.addresses.find(
                (item) => String(item._id) !== String(address._id)
            );

            if (nextDefault) {
                nextDefault.isDefault = true;
            }
        }

        address.country = addressPayload.country;
        address.countryCode = addressPayload.countryCode;
        address.city = addressPayload.city;
        address.address1 = addressPayload.address1;
        address.address2 = addressPayload.address2;
        address.zipCode = addressPayload.zipCode;
        address.addressType = addressPayload.addressType;
        address.isDefault = shouldBeDefault;

        await user.save();

        const updatedUser = await User.findById(user._id);

        res.status(200).json({
            success: true,
            message: "Address updated successfully.",
            user: updatedUser,
        });
    })
);

router.delete(
    "/delete-address/:addressId",
    isAuthenticated,
    catchAsyncError(async (req, res, next) => {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next(new ErrorHandler("User not found.", 404));
        }

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return next(new ErrorHandler("Address not found.", 404));
        }

        const wasDefault = address.isDefault;
        address.deleteOne();

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();

        const updatedUser = await User.findById(user._id);

        res.status(200).json({
            success: true,
            message: "Address deleted successfully.",
            user: updatedUser,
        });
    })
);
module.exports = router;
