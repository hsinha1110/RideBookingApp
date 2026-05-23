//======================================================
// routes/userRoutes.ts
//======================================================

import express from "express";

import { getProfile, updateProfile } from "../controllers/userController";

import { protect } from "../middlewares/authMiddleware";

import upload from "../middlewares/upload";

const router = express.Router();

//======================================================
// GET PROFILE
//======================================================

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get logged in user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.get(
  "/profile",

  protect,

  getProfile,
);

//======================================================
// UPDATE PROFILE
//======================================================

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.put(
  "/profile",

  protect,

  upload.single("profileImage"),

  updateProfile,
);

export default router;
