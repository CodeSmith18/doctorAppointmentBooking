// src/pages/MeetingPage.jsx
import { useParams } from "react-router-dom";
import VideoCall from "../components/VideoCall";

export default function MeetingPage() {
  const { meetingId } = useParams();
  return <VideoCall meetingId={meetingId} />;
}
