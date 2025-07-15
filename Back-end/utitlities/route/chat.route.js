import express from 'express';
const router = express.Router();
import debateJudge from '../controller/model.js';

router.post('/message',
    async (req,res)=>{
        const {newMessage} = req.body;
        console.log(newMessage);
    try {
        const result = await debateJudge(newMessage);
        res.status(200).json({
            reply:result
        })
        console.log(result);
        
    } catch (error) {
        
    }
});

export default router