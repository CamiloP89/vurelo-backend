const { io } = require("socket.io-client");

const socket = io("http://localhost:3000", {
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("🟢 Conectado al WebSocket");
});

socket.on("transaction_created", (data) => {
  console.log("📡 Evento recibido:", data);
});

socket.on("disconnect", () => {
  console.log("🔴 Desconectado");
});
