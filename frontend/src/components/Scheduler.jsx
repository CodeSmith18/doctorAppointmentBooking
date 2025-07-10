import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BACKEND_URL;

export default async function createMeetingLink() {
  try {
    const res = await axios.post(`${SERVER_URL}/api/meetings/create`, {
      scheduledFor: new Date(),
    });
    const id = res.data.meetingId;
    console.log(id);
    // return `/meeting/${id}`; // relative link
    return `/meeting/${id}`;

   
  } catch (error) {
    console.error("Error creating meeting:", error);
    return null;
  }
}
