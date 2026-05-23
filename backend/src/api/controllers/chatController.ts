//======================================================
// controllers/chatController.ts
//======================================================

import { Request, Response } from "express";

import Message from "../models/message";

//======================================================
// GET CHAT MESSAGES
//======================================================

export const getMessages = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    //==================================================
    // PARAMS
    //==================================================

    const { rideId } = req.params;

    console.log(rideId, "======= RIDE ID =======");

    //==================================================
    // FIND MESSAGES
    //==================================================

    const messages = await Message.find({
      ride: rideId,
    })
      .populate({
        path: "user",

        select: "fullName profileImage",

        transform: (doc: any) => ({
          _id: String(doc._id),

          name: doc.fullName,

          avatar: doc.profileImage,
        }),
      })
      .sort({
        createdAt: 1,
      });

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      messages,
    });
  } catch (error) {
    console.log(error, "======= GET MESSAGE ERROR =======");

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};
