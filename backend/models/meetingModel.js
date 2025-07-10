import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  hostId: { type: String, required: true },
  scheduledTime: { type: Date, required: true },
  roomId: { type: String, unique: true, required: true },
}, {
  timestamps: true,
});

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;