const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Socket.IO chat server is running.");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("chat:message", (payload) => {
    io.emit("chat:message", payload);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});