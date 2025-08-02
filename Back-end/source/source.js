import express from 'express'
import dotenv from 'dotenv'
import userRoute from '../utitlities/route/user.route.js'
import chatMessage from '../utitlities/route/chat.route.js'
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import { connectDB } from '../utitlities/Database/connectDB.js';
const app = express();
connectDB();
import cors from 'cors';
app.use(cors({
    origin:"http://localhost:5173"
}))
app.use(express.json())

app.use('/user',userRoute)
app.use('/chat',chatMessage)

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "*",
        methods:["GET","POST"],
    }
});
const users = [];

io.on("connection",socket =>{
    socket.on("adduser",username =>{
        socket.user = username;
        users.push(username);
        io.sockets.emit("users",users);
    });

    socket.on("message",message =>{
        console.log(message);
        io.sockets.emit("message",{
            message, user:socket.user, id: socket.id
        })
    });

    
})


server.listen(4476,()=> console.log("Server on PORT 4476"));