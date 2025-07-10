import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { joinMeeting } from '../../api/meeting';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';


const MeetingRoom = () => {
  const { roomId } = useParams();
  const [config, setConfig] = useState(null);
  const containerRef = useRef(null);
  const userId = 'user_' + Math.floor(Math.random() * 10000);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await joinMeeting({ roomId, userId });
      setConfig({
        appId: res.data.appId,
        token: res.data.token,
        userId,
        roomId
      });
    };
    fetchToken();
  }, [roomId]);

  useEffect(() => {
    if (config && containerRef.current) {
      const zp = ZegoUIKitPrebuilt.create({
        appID: config.appId,
        userID: config.userId,
        userName: config.userId,
        roomID: config.roomId,
        token: config.token,
      });
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference
        }
      });
    }
  }, [config]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default MeetingRoom;
