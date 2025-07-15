import express from 'express'
import dotenv from 'dotenv'
import userRoute from '../utitlities/route/user.route.js'
import chatMessage from '../utitlities/route/chat.route.js'
dotenv.config();
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

//port 
app.listen(4476,()=> console.log("Server on PORT 4476"));