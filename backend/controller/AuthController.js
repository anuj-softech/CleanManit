import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// ======================
// SEND OTP
// ======================

export const sendOtp = async (req, res) => {

    try {

        const {email} = req.body;


        const user = await User.findOne({email});


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


// ================= OTP EXIST CHECK =================


        if (
            user.otp &&
            user.otpCreatedAt
        ) {

            const currentTime = new Date();

            const diff =
                (currentTime - user.otpCreatedAt)
                /
                (1000 * 60); // minutes


            if (diff < 10) {

                return res.status(200).json({

                    success: true,

                    message:
                        "OTP already sent. Please use previous OTP",

                });

            }

        }


// ================= CREATE NEW OTP =================


        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();


        user.otp = otp;

        user.otpCreatedAt = new Date();


        await user.save();
        return res.status(200).json({

            success: true,

            message: "OTP Sent Successfully" + otp

        });

// ================= SEND MAIL =================


        await axios.post(
            "https://api.brevo.com/v3/smtp/email",

            {

                sender: {
                    name: "CleanTrack",
                    email: "jyotipatewar2004@gmail.com"
                },


                to: [
                    {
                        email: user.email,
                        name: user.name
                    }
                ],


                subject: "CleanTrack OTP Verification",


                htmlContent: `

<div style="font-family:Arial;padding:20px">

<h2>CleanTrack</h2>

<p>Hello <b>${user.name}</b></p>

<p>Your OTP is:</p>

<h1 style="color:green">
${otp}
</h1>

<p>
OTP valid for 10 minutes.
</p>

</div>

`

            },

            {

                headers: {

                    accept: "application/json",

                    "api-key":
                    process.env.BREVO_API_KEY,

                    "content-type":
                        "application/json"

                }

            }
        );


        return res.status(200).json({

            success: true,

            message: "OTP Sent Successfully"

        });


    } catch (error) {

        console.log(
            error.response?.data ||
            error.message
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });

    }


};

// ======================
// VERIFY OTP
// ======================

export const verifyOtp = async (req, res) => {
    try {

        const {email, otp} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.otp !== otp) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });

        }


// Check OTP expiry

        const currentTime = new Date();

        const diff =
            (currentTime - user.otpCreatedAt) / (1000 * 60);


        if (diff > 10) {

            return res.status(400).json({
                success: false,
                message: "OTP expired. Please request new OTP."
            });

        }

        user.isVerified = true;
        user.otp = "";
        user.otpCreatedAt = null;

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d",
            }
        );

        // ================= SET HTTP-ONLY COOKIE =================
        // sameSite: "none" and secure: true allow cross-port cookie transmission (e.g. port 3000 -> 5000)
        // Chrome treats localhost as a secure origin, so secure: true works on local HTTP
        const cookieOptions = {
            httpOnly: true, // Prevents JavaScript from reading the cookie
            secure: true,   // Required for sameSite: "none" (Chrome supports this on localhost)
            sameSite: "none", // Enables cross-port/cross-site cookie transmission
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        };

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            role: user.role,
            id: user._id,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
            },
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// LOGOUT (CLEAR COOKIE)
// ======================
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================
// GET CURRENT USER (ME)
// ======================
export const getMe = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};    