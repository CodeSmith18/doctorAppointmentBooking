import axios from "axios";
import { useState } from "react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Scheduler() {
  const [link, setLink] = useState("");

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${SERVER_URL}/api/meetings/create`, {
        scheduledFor: new Date(),
      });
      const id = res.data.meetingId;
      setLink(`/meeting/${id}`); // relative link, works on same domain
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Schedule a 2-Person Meeting</h2>
      <button onClick={handleCreate}>Create Meeting</button>
      {link && (
        <p>
          Meeting Link: <a href={link}>{link}</a>
        </p>
      )}
    </div>
  );
}
