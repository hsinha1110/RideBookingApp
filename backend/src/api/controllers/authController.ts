import { Request, Response } from "express";

import jwt from "jsonwebtoken";

import User, { IUser } from "../models/user";

import cloudinary from "../../config/cloudinary";

//======================================================
// GENERATE TOKEN
//======================================================

const generateToken = (id: string) => {
  return jwt.sign(
    { id },

    process.env.JWT_SECRET || "your_jwt_secret",

    {
      expiresIn: "30d",
    },
  );
};

//======================================================
// SIGNUP
//======================================================

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body);

    console.log(req.file);

    const {
      fullName,
      email,
      phoneNumber,
      password,
      userType,
      carName,
      carNumber,
      carModel,
      carColor,
    } = req.body;

    //==================================================
    // VALIDATION
    //==================================================

    if (!fullName || !email || !phoneNumber || !password || !userType) {
      return res.status(400).json({
        success: false,

        message: "All fields are required",
      });
    }

    //==================================================
    // CHECK USER
    //==================================================

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        success: false,

        message: "Email already exists",
      });
    }

    //==================================================
    // PROFILE IMAGE
    //==================================================

    let imageUrl = "";

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
    // CREATE USER
    //==================================================

    const user: IUser = await User.create({
      fullName,

      email,

      phoneNumber,

      password,

      userType,

      profileImage: imageUrl,

      ...(userType === "driver" && {
        carDetails: {
          carName,

          carNumber,

          carModel,

          carColor,
        },
      }),
    });

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(201).json({
      success: true,

      message: "User registered successfully",

      data: {
        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        phoneNumber: user.phoneNumber,

        userType: user.userType,

        profileImage: user.profileImage,

        token: generateToken(user._id as string),
      },
    });
  } catch (error: any) {
    console.log(error);

    //==================================================
    // DUPLICATE ERROR
    //==================================================

    if (error.code === 11000 && error.keyValue) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        success: false,

        message: `An account with this ${field} already exists.`,
      });
    }

    //==================================================
    // SERVER ERROR
    //==================================================

    return res.status(500).json({
      success: false,

      message: error?.message || "Server error",
    });
  }
};

//======================================================
// LOGIN
//======================================================

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,

      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

//======================================================
// SEND OTP
//======================================================

export const sendOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber } = req.body;

    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    const otp = "123456";

    return res.status(200).json({
      success: true,

      message: "OTP sent successfully",

      otp,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};

//======================================================
// VERIFY OTP
//======================================================

export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { phoneNumber, otp } = req.body;

    const user = await User.findOne({
      phoneNumber,
    });

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    if (otp !== "123456") {
      return res.status(400).json({
        success: false,

        message: "Invalid OTP",
      });
    }

    return res.status(200).json({
      success: true,

      message: "OTP verified successfully",

      data: {
        _id: user._id,

        fullName: user.fullName,

        email: user.email,

        phoneNumber: user.phoneNumber,

        userType: user.userType,

        profileImage: user.profileImage,

        ...(user.userType === "driver" && {
          carDetails: user.carDetails,
        }),

        token: generateToken(user._id as string),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Server error",
    });
  }
};
