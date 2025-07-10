export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", (roomId) => {
      console.log(roomId);
      socket.join(roomId);
      socket.to(roomId).emit("user-joined", socket.id);
    });

    socket.on("signal", (data) => {
      const { roomId } = data;
      // Broadcast signal to others in the room except sender
      socket.to(roomId).emit("signal", data);
    });

    socket.on("disconnecting", () => {
      // Emit 'user-left' for all rooms this socket is in
      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) { // socket is always in its own room
          socket.to(roomId).emit("user-left", socket.id);
        }
      });
    });
  });
}
