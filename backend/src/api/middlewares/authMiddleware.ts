import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

import User from "../models/user";

//======================================================
// CUSTOM USER TYPE
//======================================================

interface AuthUser {
  id: string;

  email?: string;

  userType?: "rider" | "driver";
}

//======================================================
// GLOBAL REQUEST TYPE
//======================================================

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

//======================================================
// PROTECT MIDDLEWARE
//======================================================

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    let token;

    //==================================================
    // GET TOKEN
    //==================================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //==================================================
    // TOKEN MISSING
    //==================================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    //==================================================
    // VERIFY TOKEN
    //==================================================

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret",
    );

    //==================================================
    // FIND USER
    //==================================================

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    //==================================================
    // ATTACH USER
    //==================================================

    req.user = {
      id: String(user._id),

      email: user.email,

      userType: user.userType,
    };
    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};
