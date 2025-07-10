// backend/controllers/meetingController.js
import { nanoid } from "nanoid";
import Meeting from "../models/Meeting.js";

export const createMeeting = async (req, res) => {
  const meetingId = nanoid(10);
  const { scheduledFor } = req.body;

  const meeting = new Meeting({ meetingId, scheduledFor });
  await meeting.save();

  res.json({ meetingId });
};

export const getMeeting = async (req, res) => {
  const meeting = await Meeting.findOne({ meetingId: req.params.id });
  if (!meeting) return res.status(404).json({ error: "Not found" });
  res.json(meeting);
};
