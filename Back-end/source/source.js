// server.js (your main server file)
import express from 'express';
import dotenv from 'dotenv';
import userRoute from '../utitlities/route/user.route.js';
import chatMessage from '../utitlities/route/chat.route.js';
dotenv.config();
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from '../utitlities/Database/connectDB.js';
const app = express();
connectDB();
import cors from 'cors';
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use('/user', userRoute);
app.use('/chat', chatMessage);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

// expose io globally so controllers can emit
global.io = io;

const users = [];

io.on("connection", socket => {
  console.log('socket connected', socket.id);

  socket.on("adduser", username => {
    socket.user = username;
    users.push(username);
    io.sockets.emit("users", users);
  });

  socket.on("join-room", ({ roomCode, username }) => {
    if (!roomCode) return;
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.data.username = username;
    console.log(`${username} socket joined room ${roomCode}`);
  });

  socket.on("leave-room", ({ roomCode, username }) => {
    if (!roomCode) return;
    socket.leave(roomCode);
    console.log(`${username} socket left room ${roomCode}`);
  });

  socket.on("message", data => {
    io.sockets.emit("message", {
      message: data.msg, user: data.user, id: socket.id
    });
  });

  socket.on("disconnect", () => {
    console.log('socket disconnect', socket.id);
    // optional: you could attempt cleanup here using socket.data.roomCode/socket.data.username
  });
});

server.listen(4476, () => console.log("Socket server on PORT 4476"));
