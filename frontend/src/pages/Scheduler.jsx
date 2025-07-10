import { useState, useEffect } from 'react';
import { createMeeting, getMeetings } from '../../api/meeting.js';

const Scheduler = () => {
  const [topic, setTopic] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [meetings, setMeetings] = useState([]);
  const userId = 'user_' + Math.floor(Math.random() * 10000); // Simulated user

  const handleCreate = async () => {
    const res = await createMeeting({ topic, scheduledTime, hostId: userId });
    alert(`Meeting Created! Room ID: ${res.data.roomId}`);
    fetchMeetings();
  };

  const fetchMeetings = async () => {
    const res = await getMeetings();
    setMeetings(res.data);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Schedule a Meeting</h2>
      <input placeholder="Topic" onChange={e => setTopic(e.target.value)} /><br />
      <input type="datetime-local" onChange={e => setScheduledTime(e.target.value)} /><br />
      <button onClick={handleCreate}>Create Meeting</button>

      <h3>All Meetings</h3>
      <ul>
        {meetings.map(m => (
          <li key={m.roomId}>
            {m.topic} @ {new Date(m.scheduledTime).toLocaleString()}<br />
            <a href={`/meeting/${m.roomId}`}>Join</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Scheduler;
