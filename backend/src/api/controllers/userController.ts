import { Request, Response } from "express";

import User from "../models/user";

import cloudinary from "../../config/cloudinary";

//======================================================
// GET PROFILE
//======================================================

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    //==================================================
    // AUTH CHECK
    //==================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    //==================================================
    // FIND USER
    //==================================================

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      data: user,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error?.message || "Server error",
    });
  }
};

//======================================================
// UPDATE PROFILE
//======================================================

export const updateProfile = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    //==================================================
    // AUTH CHECK
    //==================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user.id;

    const { fullName, email, phoneNumber, bio, gender } = req.body;

    //==================================================
    // FIND USER
    //==================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //==================================================
    // IMAGE URL
    //==================================================

    let imageUrl = user.profileImage;

    //==================================================
    // CLOUDINARY UPLOAD
    //==================================================

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "ride-booking/profile",
      });

      imageUrl = uploadedImage.secure_url;
    }

    //==================================================
    // UPDATE USER
    //==================================================

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        email,
        phoneNumber,
        bio,
        gender,

        profileImage: imageUrl,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,

      message: "Profile updated successfully",

      data: updatedUser,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error?.message || "Server error",
    });
  }
};
