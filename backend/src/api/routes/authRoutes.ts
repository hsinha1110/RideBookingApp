import express from "express";

import {
  signup,
  login,
  sendOTP,
  verifyOTP,
} from "../controllers/authController";

import upload from "../middlewares/upload";

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phoneNumber
 *               - userType
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               userType:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/signup",

  upload.single("profileImage"),

  signup,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP
 *     tags: [Auth]
 */
router.post("/send-otp", sendOTP);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 */
router.post("/verify-otp", verifyOTP);

export default router;
