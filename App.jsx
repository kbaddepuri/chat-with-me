import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

const socket = io();

export default function App() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [pc, setPc] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [bodyPixNet, setBodyPixNet] = useState(null);

  useEffect(() => {
    socket.on("chat message", (msg) => setMessages((m) => [...m, msg]));
    socket.on("offer", async (offer) => {
      const newPc = createPeer();
      await newPc.setRemoteDescription(offer);
      const answer = await newPc.createAnswer();
      await newPc.setLocalDescription(answer);
      socket.emit("answer", answer);
    });
    socket.on("answer", (answer) => pc && pc.setRemoteDescription(answer));
    socket.on("ice-candidate", (c) => pc && pc.addIceCandidate(c));
  }, [pc]);

  const createPeer = () => {
    const newPc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    newPc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };
    newPc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", e.candidate);
    };
    setPc(newPc);
    return newPc;
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideoRef.current.srcObject = stream;
    setLocalStream(stream);

    const newPc = createPeer();
    stream.getTracks().forEach((t) => newPc.addTrack(t, stream));

    const offer = await newPc.createOffer();
    await newPc.setLocalDescription(offer);
    socket.emit("offer", offer);
  };

  const sendMessage = () => {
    if (!msgInput.trim()) return;
    const msg = "Me: " + msgInput;
    setMessages((m) => [...m, msg]);
    socket.emit("chat message", msg);
    setMsgInput("");
  };

  const toggleBlur = async () => {
    if (!localStream) return;
    if (!bodyPixNet) setBodyPixNet(await bodyPix.load());
    setBlurEnabled((prev) => !prev);
    if (!blurEnabled) {
      const videoTrack = localStream.getVideoTracks()[0];
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const video = document.createElement("video");
      video.srcObject = new MediaStream([videoTrack]);
      video.play();

      const process = async () => {
        const segmentation = await bodyPixNet.segmentPerson(video);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        bodyPix.drawBokehEffect(canvas, video, segmentation, 15, 7, true);
        requestAnimationFrame(process);
      };
      process();
      const blurredStream = canvas.captureStream(25);
      const sender = pc.getSenders().find((s) => s.track.kind === "video");
      sender.replaceTrack(blurredStream.getTracks()[0]);
    } else {
      const sender = pc.getSenders().find((s) => s.track.kind === "video");
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video section */}
      <div className="flex flex-col flex-1 items-center justify-center bg-black relative">
        <video ref={localVideoRef} autoPlay muted playsInline className="rounded-xl w-1/3 border-2 border-white absolute bottom-4 right-4 shadow-lg"/>
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"/>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button onClick={startCall} className="bg-green-600 px-4 py-2 rounded-lg text-white">Start Call</button>
          <button onClick={toggleBlur} className="bg-blue-600 px-4 py-2 rounded-lg text-white">
            {blurEnabled ? "Disable Blur" : "Enable Blur"}
          </button>
        </div>
      </div>

      {/* Chat sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 font-bold border-b">Chat</div>
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="bg-gray-100 p-2 rounded-md">{m}</div>
          ))}
        </div>
        <div className="p-2 border-t flex gap-2">
          <input
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            className="flex-1 border rounded-md px-2"
            placeholder="Type message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-3 rounded-md">Send</button>
        </div>
      </div>
    </div>
  );
}
