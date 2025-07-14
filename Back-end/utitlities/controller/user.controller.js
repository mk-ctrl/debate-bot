import createUser from '../model/user.model.js';
import bcrypt from 'bcrypt'
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
            return res.status(200).json({
                message:"Account Creation Successful"
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