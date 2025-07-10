import { v4 as uuidv4 } from "uuid";
import generateToken from '../utils/zegoToken.js';

let meetings = []; 

export const createMeeting = (req, res) => {
  const { topic, hostId, scheduledTime } = req.body;
  const roomId = uuidv4();
  meetings.push({ topic, hostId, scheduledTime, roomId });
  res.json({ roomId });
};


export const joinMeeting = async (req, res) => {
  try {
    const { userId, roomId } = req.body;
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });

    const token = generateToken(
      parseInt(process.env.ZEGO_APP_ID),
      process.env.ZEGO_SERVER_SECRET,
      userId
    );

    res.json({ token, appId: parseInt(process.env.ZEGO_APP_ID), roomId });
  } catch (err) {
    res.status(500).json({ message: "Failed to join meeting", error: err.message });
  }
};


export const getAllMeetings = (req, res) => {
  res.json(meetings);
};
