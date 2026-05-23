//======================================================
// controllers/rideController.ts
//======================================================

import { Request, Response } from "express";

import Ride from "../models/ride";

import User from "../models/user";

import { getIO } from "../../socket/socketInstance";

//======================================================
// REQUEST RIDE
//======================================================

export const requestRide = async (
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

    //==================================================
    // BODY
    //==================================================

    const { pickup, destination } = req.body;

    const riderId = req.user.id;

    //==================================================
    // VALIDATION
    //==================================================

    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: "Pickup and destination required",
      });
    }

    //==================================================
    // CREATE RIDE
    //==================================================

    const newRide = await Ride.create({
      rider: riderId,

      pickupLocation: {
        type: "Point",

        coordinates: [pickup.longitude, pickup.latitude],

        address: pickup.description,

        place_id: pickup.place_id,

        name: pickup.name,
      },

      destinationLocation: {
        type: "Point",

        coordinates: [destination.longitude, destination.latitude],

        address: destination.description,

        place_id: destination.place_id,

        name: destination.name,
      },

      status: "pending",
    });

    //==================================================
    // POPULATE
    //==================================================

    const ride = await Ride.findById(newRide._id).populate(
      "rider",
      "fullName phoneNumber",
    );

    //==================================================
    // FIND DRIVERS
    //==================================================

    const drivers = await User.find({
      userType: "driver",
    });

    console.log(`Found ${drivers.length} nearby drivers`);

    //==================================================
    // SOCKET
    //==================================================

    const io = getIO();

    if (io) {
      io.emit("new_ride_request", ride);
    }

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(201).json({
      success: true,

      data: ride,
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
// ACCEPT / REJECT RIDE
//======================================================

export const acceptRejectRide = async (
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

    const { rideId, status } = req.body;

    const driverId = req.user.id;

    //==================================================
    // FIND RIDE
    //==================================================

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    //==================================================
    // ALREADY ACCEPTED
    //==================================================

    if (ride.driver && ride.driver.toString() !== driverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Ride already accepted",
      });
    }

    //==================================================
    // VALID STATUS
    //==================================================

    const validStatuses = [
      "pending",
      "accepted",
      "ongoing",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    //==================================================
    // UPDATE RIDE
    //==================================================

    ride.driver = new mongoose.Types.ObjectId(driverId);
    ride.status = status;

    await ride.save();

    //==================================================
    // SOCKET
    //==================================================

    const io = getIO();

    if (io) {
      const roomName = `ride_${rideId}`;

      io.to(roomName).emit("ride_update", {
        rideId,
        status,
      });

      if (status === "accepted") {
        io.emit("rideAccepted", {
          rideId,
          driverId,
        });
      }

      if (status === "cancelled") {
        io.emit("rideCancelled", {
          rideId,
        });
      }
    }

    //==================================================
    // RESPONSE
    //==================================================

    return res.status(200).json({
      success: true,
      data: ride,
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
// CANCEL RIDE
//======================================================

export const cancelRide = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    ride.status = "cancelled";

    await ride.save();

    const io = getIO();

    if (io) {
      io.emit("rideCancelledByRider", {
        rideId: ride._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
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
// ALL DRIVER RIDES
//======================================================

export const allDriverRides = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const rides = await Ride.find({
      driver: req.user.id,
    });

    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//======================================================
// ALL RIDER RIDES
//======================================================

export const allRiderRides = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { type, userType } = req.query;

    let statusFilter: string[] = [];

    if (type === "current") {
      statusFilter = ["pending", "accepted", "ongoing"];
    } else if (type === "past") {
      statusFilter = ["completed", "cancelled"];
    }

    const rides = await Ride.find({
      [userType === "driver" ? "driver" : "rider"]: req.user.id,

      status: {
        $in: statusFilter,
      },
    })
      .populate("driver", "fullName profileImage rating carDetails")
      .populate("rider", "fullName phoneNumber")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//======================================================
// PENDING RIDES
//======================================================

export const pendingRides = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const rides = await Ride.find({
      status: "pending",
    })
      .populate("rider", "fullName phoneNumber")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//======================================================
// GET RIDE BY ID
//======================================================

export const getRideById = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId)
      .populate("rider", "fullName phoneNumber")
      .populate("driver", "fullName profileImage rating carDetails");

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
