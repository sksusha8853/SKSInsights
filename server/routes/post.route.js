import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletepost, getposts } from '../controllers/post.controller.js';


const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.delete('/deletepost/:postid/:userId', verifyToken, deletepost);

export default router;