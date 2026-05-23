import express from "express";

import { protect } from "../middlewares/authMiddleware";

import {
  saveFcmToken,
  sendTestNotification,
} from "../controllers/notificationController";

const router = express.Router();

//================================================
// SAVE FCM TOKEN
//================================================

router.post("/save-token", protect, saveFcmToken);

//================================================
// SEND TEST NOTIFICATION
//================================================

router.post("/send", protect, sendTestNotification);

export default router;
