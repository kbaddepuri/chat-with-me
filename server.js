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
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.static(__dirname));

const profiles = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Default profile
  profiles[socket.id] = {
    alias: "User" + Math.floor(Math.random() * 1000),
    pic: null
  };

  // Profile update
  socket.on("update profile", ({ alias, pic }) => {
    profiles[socket.id] = { alias, pic };
    console.log(`🔄 Profile updated: ${alias}`);
  });

  // Group join
  socket.on("join group", ({ group }) => {
    socket.join(group);
    const profile = profiles[socket.id];
    console.log(`👥 ${profile.alias} joined group ${group}`);
  });

  // Messages
  socket.on("chat message", (msg) => {
    const profile = profiles[socket.id] || { alias: "Unknown", pic: null };
    const messageWithProfile = {
      ...msg,
      alias: profile.alias,
      pic: profile.pic,
      timestamp: msg.timestamp || new Date().toISOString()
    };
    io.to(msg.group).emit("chat message", messageWithProfile);
  });

  // Typing
  socket.on("typing", ({ group }) => {
    const profile = profiles[socket.id];
    socket.to(group).emit("typing", profile.alias);
  });

  socket.on("stop typing", ({ group }) => {
    const profile = profiles[socket.id];
    socket.to(group).emit("stop typing", profile.alias);
  });

  // Read receipts
  socket.on("message read", ({ id, group }) => {
    socket.to(group).emit("message read", id);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    delete profiles[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
