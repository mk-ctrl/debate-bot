import createRoom from "../model/room.model.js";

export const Create_Room = async (req,res)=>{
    try {
        const {name,roomCode,topic} = req.body;
        console.log(roomCode);
        const user = await createRoom.findOne({roomCode});
        console.log(user)
        if(user){
            return res.status(400).json({
                message:"Room Code already Exists, Create a New One"
            })
        }
        const newRoom = new createRoom({
            host:name,
            code:roomCode,
            users:[name],
            topic:topic
        })
        if(newRoom){
            await newRoom.save();
            res.status(200).json({
                message:"Room Code generated Successfully",
                user:newRoom.users,
                topic:newRoom.topic,
                host:newRoom.host,
                roomCode:newRoom.code
            })
        }
    } catch (error) {
        
    }
}

export const JoinRoom = async (req,res)=>{
    try {
        const {name,roomCode,side} = req.body;
        console.log(roomCode);
        const newRoom = await createRoom.findOne({code:roomCode});
        
        if(!newRoom){
            return res.status(400).json({
                message:"Room Code not found"
            })
        }
        newRoom.users.push(name);
        if(side === 'bg-red-700') newRoom.team_red.push(name);
        else newRoom.team_blue.push(name);
        await newRoom.save(); 
        res.status(200).json({
            message:"Room Found,Entering Debate",
                user:newRoom.users,
                topic:newRoom.topic,
                host:newRoom.host,
                username:name,
                roomCode:newRoom.code,
                team_red:newRoom.team_red,
                team_blue:newRoom.team_blue
        })
        
    } catch (error) {
        console.error(error);
    }
}