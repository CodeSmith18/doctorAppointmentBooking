// backend/models/Meeting.js
import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  meetingId: String,
  scheduledFor: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Meeting", meetingSchema);
