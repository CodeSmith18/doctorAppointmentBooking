import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import { Server } from "socket.io";
import meetingRoutes from "./routes/meetingRoutes.js";
import setupSocket from "./socket.js";
import http from "http";

// app config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

app.use("/api/meetings", meetingRoutes);

// Socket setup
setupSocket(io);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Start the server (important: start the http server, not app.listen)
server.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});
