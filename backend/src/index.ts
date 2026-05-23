import dotenv from "dotenv";

//======================================================
// ENV CONFIG
//======================================================

dotenv.config({
  path: ".env",
});

import express, { Request, Response } from "express";

import bodyParser from "body-parser";

import cors from "cors";

import http from "http";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec, swaggerUiOptions } from "./config/swagger";

//======================================================
// DATABASE
//======================================================

import "./config/db";

//======================================================
// ROUTES
//======================================================

import authRoutes from "./api/routes/authRoutes";

import driverRoutes from "./api/routes/driverRoutes";

import rideRoutes from "./api/routes/rideRoutes";

import chatRoutes from "./api/routes/chatRoutes";

import userRoutes from "./api/routes/userRoutes";

import notificationRoutes from "./api/routes/notificationRoutes";
//======================================================
// SOCKET
//======================================================

import initializeSocket from "./socket/riderSocket";

//======================================================
// DEBUG
//======================================================

//======================================================
// EXPRESS APP
//======================================================

const app = express();

//======================================================
// CREATE HTTP SERVER
//======================================================

const server = http.createServer(app);

//======================================================
// INITIALIZE SOCKET
//======================================================

const io = initializeSocket(server);

//======================================================
// STORE IO INSTANCE
//======================================================

app.set("io", io);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//======================================================
// MIDDLEWARES
//======================================================

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

//======================================================
// PORT
//======================================================

const PORT = process.env.PORT || 5001;

//======================================================
// API ROUTES
//======================================================

app.use("/api/auth", authRoutes);

app.use("/api/driver", driverRoutes);

app.use("/api/ride", rideRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/user", userRoutes);

app.use("/api/notification", notificationRoutes);

//======================================================
// SWAGGER DOCS
//======================================================

app.use(
  "/api-docs",

  swaggerUi.serve,

  swaggerUi.setup(swaggerSpec, swaggerUiOptions),
);

//======================================================
// HOME ROUTE
//======================================================

app.get("/", (req: Request, res: Response) => {
  res.send("Uber Clone Backend Running");
});

//======================================================
// START SERVER
//======================================================

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
