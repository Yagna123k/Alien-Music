let roomState = {}; // { roomCode: { action, timestamp } }

module.exports = (io, socket) => {
  console.log("🔌 Connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    if (roomState[roomId]) socket.emit("sync", roomState[roomId]);
  });

  socket.on("action", ({ roomId, action, timestamp }) => {
    roomState[roomId] = { action, timestamp };
    io.to(roomId).emit("sync", roomState[roomId]);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
};
