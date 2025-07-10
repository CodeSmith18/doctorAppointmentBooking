// backend/routes/meetingRoutes.js
import express from "express";
import { createMeeting, getMeeting } from "../controllers/meetingController.js";

const router = express.Router();

router.post("/create", createMeeting);
router.get("/:id", getMeeting);

export default router;
