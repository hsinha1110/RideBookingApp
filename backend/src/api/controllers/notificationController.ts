import { Request, Response } from "express";

import admin from "../../config/firebase";

import User from "../models/user";

//================================================
// SAVE FCM TOKEN
//================================================

export const saveFcmToken = async (req: Request, res: Response) => {
  try {
    const { fcmToken } = req.body;

    const userId = req.user?.id;

    //============================================
    // VALIDATION
    //============================================

    if (!fcmToken) {
      return res.status(400).json({
        success: false,

        message: "FCM token is required",
      });
    }

    //============================================
    // UPDATE TOKEN
    //============================================

    await User.findByIdAndUpdate(userId, {
      fcmToken,
    });

    return res.status(200).json({
      success: true,

      message: "FCM token saved successfully",
    });
  } catch (error) {
    console.log(error, "======= SAVE FCM TOKEN ERROR =======");

    return res.status(500).json({
      success: false,

      message: "Something went wrong",
    });
  }
};

//================================================
// SEND TEST NOTIFICATION
//================================================

export const sendTestNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, body } = req.body;

    //============================================
    // VALIDATION
    //============================================

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,

        message: "userId, title and body are required",
      });
    }

    //============================================
    // FIND USER
    //============================================

    const user = await User.findById(userId);

    if (!user || !user.fcmToken) {
      return res.status(404).json({
        success: false,

        message: "FCM token not found",
      });
    }

    //============================================
    // SEND PUSH
    //============================================

    const response = await admin.messaging().send({
      token: user.fcmToken,

      notification: {
        title,
        body,
      },

      data: {
        type: "test",
      },
    });

    console.log(response, "======= NOTIFICATION SENT =======");

    return res.status(200).json({
      success: true,

      message: "Notification sent successfully",

      response,
    });
  } catch (error) {
    console.log(error, "======= SEND NOTIFICATION ERROR =======");

    return res.status(500).json({
      success: false,

      message: "Something went wrong",
    });
  }
};
