import express from 'express';
import { signUp } from '../controller/user.controller.js';

const router = express.Router();

router.post('/checkUser',signUp)

export default router;