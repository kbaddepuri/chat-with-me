import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: false }
});

app.use(express.static(__dirname));

// Basic health endpoint helps distinguish server/deployment issues from WebRTC issues.
app.get("/health", (_req, res) => res.json({ ok: true }));

// STUN helps discover direct routes. TURN is required on some networks.
// Configure TURN_URLS (comma-separated), TURN_USERNAME, and TURN_CREDENTIAL
// in the deployment environment to enable relay fallback.
app.get("/webrtc-config", (_req, res) => {
  const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" }
  ];
  const turnUrls = (process.env.TURN_URLS || "").split(",").map((url) => url.trim()).filter(Boolean);
  if (turnUrls.length && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    iceServers.push({
      urls: turnUrls,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_CREDENTIAL
    });
  }
  res.setHeader("Cache-Control", "no-store");
  res.json({ iceServers, turnConfigured: turnUrls.length > 0 });
});

// Socket.IO is used only for signaling. WebRTC carries audio/video whenever
// a direct connection is possible; TURN is needed on some restrictive networks.
const displayNames = new Map();
const activeCalls = new Map();

function broadcastUsers() {
  io.emit("online-users", [...displayNames.entries()].map(([id, name]) => ({ id, name })));
}

io.on("connection", (socket) => {
  socket.on("register-user", (name) => {
    const safeName = typeof name === "string" ? name.trim().slice(0, 32) : "";
    displayNames.set(socket.id, safeName || "Guest");
    broadcastUsers();
  });

  socket.on("chat message", (msg) => {
    if (!msg || typeof msg.text !== "string") return;
    io.emit("chat message", {
      user: displayNames.get(socket.id) || "Guest",
      text: msg.text.slice(0, 4000)
    });
  });

  // Typing events are private to the selected chat partner.
  socket.on("typing", ({ targetId, isTyping } = {}) => {
    if (!targetId || targetId === socket.id || !displayNames.has(targetId)) return;
    io.to(targetId).emit("typing", {
      fromId: socket.id,
      fromName: displayNames.get(socket.id) || "Guest",
      isTyping: Boolean(isTyping)
    });
  });

  socket.on("call-user", ({ targetId } = {}) => {
    if (!targetId || targetId === socket.id || !displayNames.has(targetId)) {
      socket.emit("call-error", "That user is no longer online.");
      return;
    }
    if (activeCalls.has(socket.id) || activeCalls.has(targetId)) {
      socket.emit("call-error", "One of the users is already in a call.");
      return;
    }
    activeCalls.set(socket.id, targetId);
    activeCalls.set(targetId, socket.id);
    io.to(targetId).emit("incoming-call", {
      fromId: socket.id,
      fromName: displayNames.get(socket.id) || "Guest"
    });
  });

  socket.on("call-accepted", ({ targetId } = {}) => {
    if (activeCalls.get(socket.id) !== targetId || activeCalls.get(targetId) !== socket.id) return;
    io.to(targetId).emit("call-accepted", { fromId: socket.id });
  });

  for (const eventName of ["webrtc-offer", "webrtc-answer", "ice-candidate"]) {
    socket.on(eventName, ({ targetId, data } = {}) => {
      if (!targetId || activeCalls.get(socket.id) !== targetId || activeCalls.get(targetId) !== socket.id) {
        socket.emit("call-debug", { level: "warning", message: "Signaling event rejected: call participants do not match." });
        return;
      }
      if (data == null) return;
      io.to(targetId).emit(eventName, { fromId: socket.id, data });
    });
  }

  socket.on("call-declined", ({ targetId } = {}) => {
    if (activeCalls.get(socket.id) === targetId) {
      activeCalls.delete(socket.id);
      activeCalls.delete(targetId);
      io.to(targetId).emit("call-declined");
    }
  });

  socket.on("end-call", () => {
    const peerId = activeCalls.get(socket.id);
    activeCalls.delete(socket.id);
    if (peerId) {
      activeCalls.delete(peerId);
      io.to(peerId).emit("call-ended");
    }
  });

  socket.on("disconnect", () => {
    const peerId = activeCalls.get(socket.id);
    activeCalls.delete(socket.id);
    if (peerId) {
      activeCalls.delete(peerId);
      io.to(peerId).emit("call-ended");
    }
    displayNames.delete(socket.id);
    broadcastUsers();
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Chat-with-me running on port ${PORT}`));
