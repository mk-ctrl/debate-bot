import createRoom from "../model/room.model.js";

export const Create_Room = async (req,res)=>{
    try {
        const {name,roomCode} = req.body;
        console.log(roomCode);
        const user = await createRoom.findOne({roomCode});
        if(user){
            res.status(400).json({
                message:"Room Code already Exists, Create a New One"
            })
        }
        const newRoom = new createRoom({
            host:name,
            code:roomCode,
            users:[name]
        })
        if(newRoom){
            await newRoom.save();
            res.status(200).json({
                message:"Room Code generated Successfully"
            })
        }
    } catch (error) {
        
    }
}

export const JoinRoom = async (req,res)=>{
    try {
        const {name,roomCode} = req.body;
        console.log(roomCode);
        const user = await createRoom.findOne({code:roomCode});
        user.users.push(name);
        await user.save(); 
        if(user){
            res.status(200).json({
                message:"Room Code found, Entering Debate"
            })
        }
        else{
            res.status(400).json({
                message:"Room Code not Found"
            })
        }
    } catch (error) {
        
    }
}