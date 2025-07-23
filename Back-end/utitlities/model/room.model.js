import mongoose from 'mongoose';

const Room = new mongoose.Schema({
    host:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true,
    },
    topic:{
        type:String,
        
    },
    users: {
        type:[String],
        default:[]
    }
},
{timestamps:true});

const createRoom = mongoose.model('Room',Room);
export default createRoom;
