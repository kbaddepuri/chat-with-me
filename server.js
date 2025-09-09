io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chat message", (data) => {
    socket.broadcast.emit("chat message", data);
  });

  // WebRTC signaling
  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
