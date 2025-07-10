import express from "express";
import {
  createMeeting,
  joinMeeting,
  getAllMeetings
} from "../controllers/meetingController.js";

import authUser from '../middleware/authUser.js';  // import your auth middleware

const meetingRouter = express.Router();

meetingRouter.post("/create", authUser, createMeeting);   // protect route
meetingRouter.post("/join", authUser, joinMeeting);       // protect route
meetingRouter.get("/", authUser, getAllMeetings);         // protect route

export default meetingRouter;
