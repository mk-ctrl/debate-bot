import mongoose from "mongoose";

const User = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},
{timestamps:true}
);

//Create a model
const createUser = mongoose.model('User',User);
export default createUser