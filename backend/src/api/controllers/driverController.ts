import { Request, Response } from "express";

import User from "../models/user";

import { getIO } from "../../socket/socketInstance";

//======================================================
// GET DRIVER STATUS
//======================================================

export const getDriverStatus = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { driverId } = req.params;

    const driver = await User.findById(driverId).select("-password");

    if (!driver || driver.userType !== "driver") {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        latitude: driver.location?.coordinates?.[1] || 0,

        longitude: driver.location?.coordinates?.[0] || 0,

        heading: driver.location?.heading || 0,
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

//======================================================
// UPDATE LOCATION
//======================================================

export const updateLocation = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { driverId, lat, lng, heading = 0, rideId = null } = req.body;

    if (!driverId || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Driver ID and location required",
      });
    }

    const driver = await User.findById(driverId);

    if (!driver || driver.userType !== "driver") {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.location = {
      type: "Point",

      coordinates: [Number(lng), Number(lat)],

      heading: Number(heading) || 0,
    };

    await driver.save();

    const io = getIO();

    if (io && rideId) {
      io.to(`ride_${rideId}`).emit("update_driver_location", {
        driverId,

        latitude: driver.location.coordinates[1],

        longitude: driver.location.coordinates[0],

        heading: driver.location.heading || 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
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
// UPDATE LOCATION BACKGROUND
//======================================================

export const updateLocationBackground = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { driverId, location, rideId = null } = req.body;

    if (!driverId || !location) {
      return res.status(400).json({
        success: false,
        message: "Driver ID and location required",
      });
    }

    const { coords } = location;

    const { latitude: lat, longitude: lng, heading = 0 } = coords;

    const driver = await User.findById(driverId);

    if (!driver || driver.userType !== "driver") {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    driver.location = {
      type: "Point",

      coordinates: [Number(lng), Number(lat)],

      heading: Number(heading) || 0,
    };

    await driver.save();

    const io = getIO();

    if (io && rideId) {
      io.to(`ride_${rideId}`).emit("update_driver_location", {
        driverId,

        latitude: driver.location.coordinates[1],

        longitude: driver.location.coordinates[0],

        heading: driver.location.heading || 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Background location updated",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
