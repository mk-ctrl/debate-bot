import createUser from '../model/user.model.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const signUp = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await createUser.findOne({email});
        if(user){
            return res.status(400).json({
                message:"Account Exists"
            })
        }

        //bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        //Insert User
        const newUser = new createUser({
            email,
            password:hashedPassword
        })
        if(newUser){
            newUser.save();
            const token = jwt.sign(
                {id:user._id,email:user.email},
                process.env.JWT_SECRET,
                {expiresIn:process.env.JWT_EXPIRES_IN},
            );
            return res.status(200).json({
                message:"Account Creation Successful",
                token
            })
        }

        
        else{
            return res.status(400).json({
                message:"Failure in Creation"
            })
        }

    } catch (error) {
        console.log(error);
        
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(email);
        const user = await createUser.findOne({email});
        if(user){
            const bcryptPass = await bcrypt.compare(password,user.password);
            if(bcryptPass){
                const token = jwt.sign(
                {id:user._id,email:user.email},
                process.env.JWT_SECRET,
                {expiresIn:process.env.JWT_EXPIRES_IN},
            );
                res.status(200).json({
                    message:"Account Found, Logging In",
                    token
                })
            }
            else{
                res.status(400).json({
                    message:"Incorrect Password"
                })
            }
        }
        else{
            res.status(400).json({
                message:"user not found"
            })
        }
        

    } catch (error) {
        console.log(error);
        
    }
}