// src/components/VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";
import "./VideoCall.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoCall({ meetingId }) {
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);

  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioOutputs, setAudioOutputs] = useState([]);
  const [selectedAudioOutput, setSelectedAudioOutput] = useState("");

  // Enumerate devices and set initial camera/audio output
  useEffect(() => {
    async function getDevices() {
      console.log("🔍 Enumerating media devices...");

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        const audioOutputs = devices.filter((d) => d.kind === "audiooutput");

        console.log("🎥 Video Inputs:", videoDevices);
        console.log("🎙️ Audio Inputs:", audioInputs);
        console.log("🔊 Audio Outputs:", audioOutputs);

        if (videoDevices.length === 0) {
          console.warn("⚠️ No video input devices found.");
        }

        if (audioInputs.length === 0) {
          console.warn("⚠️ No audio input devices found.");
        }

        setCameras(videoDevices);
        setAudioOutputs(audioOutputs);

        if (videoDevices.length > 0) {
          setSelectedCameraId(videoDevices[0].deviceId);
          console.log("✅ Selected Camera ID:", videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error("❌ Error while getting media devices:", err);
      }
    }

    getDevices();
  }, []);

  // Setup WebRTC and socket connection when meetingId or camera/audio output changes
  useEffect(() => {
    if (!selectedCameraId) return;

    let cleanup;

    const init = async () => {
      console.log("Connecting to signaling server:", SERVER_URL);
      socketRef.current = io(SERVER_URL);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedCameraId } },
          audio: true,
        });

        console.log("🎥 Local media stream obtained:", stream);
        console.log("🧪 Stream Tracks:", stream.getTracks());

        stream.getVideoTracks().forEach((track, index) => {
          console.log(`📹 Video Track ${index}:`, track.label);
        });

        stream.getAudioTracks().forEach((track, index) => {
          console.log(`🎤 Audio Track ${index}:`, track.label);
        });

        localRef.current.srcObject = stream;

        // For some browsers manual play helps
        localRef.current.onloadedmetadata = () => {
          localRef.current.play().catch((e) => console.warn("Play failed", e));
        };

        peerRef.current = new RTCPeerConnection(configuration);

        stream.getTracks().forEach((track) => peerRef.current.addTrack(track, stream));

        peerRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit("signal", {
              candidate: event.candidate,
              roomId: meetingId,
            });
          }
        };

        peerRef.current.ontrack = (event) => {
          const [remoteStream] = event.streams;
          remoteRef.current.srcObject = remoteStream;

          remoteRef.current.onloadedmetadata = () => {
            remoteRef.current.play().catch((e) => console.warn("Remote play failed", e));
          };

          if (
            typeof remoteRef.current.setSinkId === "function" &&
            selectedAudioOutput
          ) {
            remoteRef.current
              .setSinkId(selectedAudioOutput)
              .catch((err) => console.warn("Sink error:", err));
          }
        };

        socketRef.current.emit("join-room", meetingId);

        const handleUserJoined = async () => {
          console.log("🔔 User joined, creating offer...");
          if (!peerRef.current.currentRemoteDescription) {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit("signal", {
              sdp: peerRef.current.localDescription,
              roomId: meetingId,
            });
          }
        };

        const handleSignal = async (data) => {
          if (data.sdp) {
            await peerRef.current.setRemoteDescription(data.sdp);
            if (data.sdp.type === "offer") {
              const answer = await peerRef.current.createAnswer();
              await peerRef.current.setLocalDescription(answer);
              socketRef.current.emit("signal", {
                sdp: peerRef.current.localDescription,
                roomId: meetingId,
              });
            }
          } else if (data.candidate) {
            try {
              await peerRef.current.addIceCandidate(data.candidate);
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          }
        };

        socketRef.current.on("user-joined", handleUserJoined);
        socketRef.current.on("signal", handleSignal);

        cleanup = () => {
          socketRef.current.off("user-joined", handleUserJoined);
          socketRef.current.off("signal", handleSignal);
          socketRef.current.disconnect();
          peerRef.current.close();

          if (localRef.current?.srcObject) {
            localRef.current.srcObject.getTracks().forEach((track) => track.stop());
          }
        };
      } catch (err) {
        console.error("🚨 Failed to get media devices or connect:", err);
      }
    };

    init();

    return () => {
      if (cleanup) cleanup();
    };
  }, [meetingId, selectedCameraId, selectedAudioOutput]);

  const toggleMic = () => {
    const audioTracks = localRef.current?.srcObject?.getAudioTracks();
    if (!audioTracks?.length) return;
    const newState = !audioTracks[0].enabled;
    audioTracks[0].enabled = newState;
    setMicEnabled(newState);
  };

  const toggleVideo = () => {
    const videoTracks = localRef.current?.srcObject?.getVideoTracks();
    if (!videoTracks?.length) return;
    const newState = !videoTracks[0].enabled;
    videoTracks[0].enabled = newState;
    setVideoEnabled(newState);
  };

  return (
    <div className="video-call-container">
      <div className="video-call-header">Meeting ID: {meetingId}</div>

      <div className="controls">
        {cameras.length > 1 && (
          <>
            <label htmlFor="cameraSelect">Camera:</label>
            <select
              id="cameraSelect"
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
            >
              {cameras.map((cam) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${cam.deviceId}`}
                </option>
              ))}
            </select>
          </>
        )}

        {audioOutputs.length > 0 && (
          <>
            <label htmlFor="audioOutput">Audio Output:</label>
            <select
              id="audioOutput"
              value={selectedAudioOutput}
              onChange={(e) => setSelectedAudioOutput(e.target.value)}
            >
              {audioOutputs.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.label || `Speaker ${d.deviceId}`}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="controls">
        <button className="control-button" onClick={toggleMic}>
          {micEnabled ? "🔊 Mic On" : "🔇 Mic Off"}
        </button>
        <button className="control-button" onClick={toggleVideo}>
          {videoEnabled ? "📷 Camera On" : "🚫 Camera Off"}
        </button>
      </div>

      <div className="video-wrapper">
        <div className="video-box">
          <h4>Local Video</h4>
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            style={{ width: "300px", backgroundColor: "black" }}
          />
        </div>
        <div className="video-box">
          <h4>Remote Video</h4>
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            style={{ width: "300px", backgroundColor: "black" }}
          />
        </div>
      </div>
    </div>
  );
}

VideoCall.propTypes = {
  meetingId: PropTypes.string.isRequired,
};
