import { Server } from "socket.io";

import jwt from "jsonwebtoken";

import { Server as HttpServer } from "http";

import Message from "../api/models/message";

import User from "../api/models/user";

import { init } from "./socketInstance";

import { CustomSocket } from "./types";

function initializeSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",

      methods: ["GET", "POST", "PUT", "DELETE"],

      allowedHeaders: ["Content-Type", "Authorization"],

      credentials: true,
    },

    transports: ["websocket", "polling"],
  });

  //================================================
  // INIT
  //================================================

  init(io);

  //================================================
  // GLOBAL ERROR
  //================================================

  io.engine.on("connection_error", (err) => {
    console.error("Socket.IO connection error:", err);
  });

  //================================================
  // AUTH MIDDLEWARE
  //================================================

  io.use(async (socket: CustomSocket, next) => {
    try {
      //================================================
      // TOKEN
      //================================================

      const token = socket.handshake.auth?.token;

      //================================================
      // CHECK TOKEN
      //================================================

      if (!token) {
        return next(new Error("Token not provided"));
      }

      //================================================
      // VERIFY
      //================================================

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "your_jwt_secret",
      );

      //================================================
      // FIND USER
      //================================================

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      //================================================
      // SAVE USER
      //================================================

      socket.user = {
        ...decoded,

        id: String(user._id),
      };

      console.log(user._id, "======= AUTH SUCCESS =======");

      next();
    } catch (err) {
      console.error("Authentication error:", (err as Error).message);

      next(new Error("Authentication failed"));
    }
  });

  //================================================
  // CONNECTION
  //================================================

  io.on("connection", (socket: CustomSocket) => {
    try {
      const userId = socket.user?.id;

      if (!userId) {
        socket.disconnect();

        return;
      }

      //================================================
      // USER ROOM
      //================================================

      const userRoom = `user_${userId}`;

      socket.join(userRoom);

      console.log(`User connected: ${userId}`);

      //================================================
      // JOIN RIDE
      //================================================

      socket.on("join_ride", (rideId: string) => {
        try {
          if (!rideId) {
            socket.emit("error", {
              message: "Invalid ride ID",
            });

            return;
          }

          const roomName = `ride_${rideId}`;

          socket.join(roomName);

          socket.activeRide = rideId;

          socket.emit("joined_ride", rideId);

          console.log(`User ${userId} joined ${roomName}`);
        } catch (err) {
          console.error("Error in join_ride:", err);

          socket.emit("error", {
            message: "Failed to join ride",
          });
        }
      });

      //================================================
      // LEAVE RIDE
      //================================================

      socket.on("leave_ride", (rideId: string) => {
        try {
          if (!rideId) {
            socket.emit("error", {
              message: "Invalid ride ID",
            });

            return;
          }

          const roomName = `ride_${rideId}`;

          socket.leave(roomName);

          if (socket.activeRide === rideId) {
            delete socket.activeRide;
          }

          console.log(`User ${userId} left ${roomName}`);
        } catch (err) {
          console.error("Error in leave_ride:", err);

          socket.emit("error", {
            message: "Failed to leave ride",
          });
        }
      });

      //================================================
      // DRIVER LOCATION UPDATE
      //================================================

      socket.on("driverLocationUpdate", (data) => {
        try {
          const { rideId, latitude, longitude } = data;

          const roomName = `ride_${rideId}`;

          io.to(roomName).emit("driverLocationUpdated", {
            rideId,
            latitude,
            longitude,
          });

          console.log(data, "======= DRIVER LOCATION EMITTED =======");
        } catch (err) {
          console.error("driverLocationUpdate error:", err);
        }
      });

      //================================================
      // SEND MESSAGE
      //================================================

      socket.on("send_message", async (data) => {
        try {
          const { text, rideId } = data;

          //================================================
          // VALIDATION
          //================================================

          if (!text || !rideId) {
            socket.emit("error", {
              message: "text and rideId are required",
            });

            return;
          }

          //================================================
          // CREATE MESSAGE
          //================================================

          const newMessage = await Message.create({
            user: userId,

            ride: rideId,

            text,
          });

          //================================================
          // POPULATE USER
          //================================================

          const populatedMessage = await Message.findById(
            newMessage._id,
          ).populate({
            path: "user",

            select: "_id fullName profileImage",
          });

          //================================================
          // CHECK
          //================================================

          if (!populatedMessage) {
            return;
          }

          //================================================
          // FORMAT MESSAGE
          //================================================

          const formattedMessage = {
            _id: populatedMessage._id,

            text: populatedMessage.text,

            createdAt: populatedMessage.createdAt,

            user: {
              _id: String((populatedMessage.user as any)?._id),

              name: (populatedMessage.user as any)?.fullName,

              avatar: (populatedMessage.user as any)?.profileImage || "",
            },
          };

          //================================================
          // ROOM
          //================================================

          const rideRoom = `ride_${rideId}`;

          //================================================
          // EMIT
          //================================================

          io.to(rideRoom).emit("receive_message", formattedMessage);

          console.log(formattedMessage, "======= FINAL MESSAGE =======");
        } catch (err) {
          console.error("Error in send_message:", err);

          socket.emit("error", {
            message: "Failed to send message",
          });
        }
      });

      //================================================
      // DISCONNECT
      //================================================

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${userId}`);
      });

      //================================================
      // SOCKET ERROR
      //================================================
      //========================================
      // RIDE STARTED
      //========================================

      socket.on("rideStarted", (data) => {
        io.emit("rideStarted", {
          rideId: data.rideId,
        });

        console.log("======= RIDE STARTED =======");
      });

      //========================================
      // RIDE COMPLETED
      //========================================

      socket.on("rideCompleted", (data) => {
        io.emit("rideCompleted", {
          rideId: data.rideId,
        });

        console.log("======= RIDE COMPLETED =======");
      });
      socket.on("error", (err) => {
        console.error("Socket error for user", userId, ":", err);
      });
    } catch (err) {
      console.error("Error in connection handler:", err);
    }
  });

  return io;
}

export default initializeSocket;
