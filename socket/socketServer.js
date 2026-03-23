const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", () => {
    console.log("Dashboard conectado");
  });
}

function emitEvent(event, data) {
  if (io) io.emit(event, data);
}

module.exports = { initSocket, emitEvent };
