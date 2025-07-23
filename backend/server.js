import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import setupSocket from "./socket.js";

import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// ------------------- Config -------------------
const app = express();
const port = process.env.PORT || 4000;

// Create HTTP server (for socket.io)
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ------------------- DB & Cloudinary -------------------
connectDB();
connectCloudinary();

// ------------------- Middlewares -------------------
app.use(express.json());
app.use(cors());

// ------------------- API Routes -------------------
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/meetings", meetingRoutes);

// ------------------- Socket Setup -------------------
setupSocket(io);

// ------------------- Serve Frontends -------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to Vite build outputs
const userDist = path.join(__dirname, "./frontend/dist");
const adminDist = path.join(__dirname, "./admin/dist");

// Serve static files
app.use("/", express.static(userDist));
app.use("/admin", express.static(adminDist));

// React router fallback (for SPAs)
app.get("/admin/*", (req, res) => {
  res.sendFile(path.join(adminDist, "index.html"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(userDist, "index.html"));
});

// ------------------- Server Start -------------------
server.listen(port,'0.0.0.0', () => {
  console.log(`Server started on PORT: ${port}`);
}); 
 