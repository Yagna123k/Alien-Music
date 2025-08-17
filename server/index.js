const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const roomSocketHandler = require("./sockets/roomSocket");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

connectDB();

app.use("/api/rooms", roomRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.send("🚀 Alien-Music Backend Running"));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => roomSocketHandler(io, socket));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
