import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { applaudComment, createComment, deleteComment, editComment, getComments, getPostComments } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/applaudComment/:commentId', verifyToken, applaudComment);
router.put('/editComment/:commentId', verifyToken, editComment);
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get('/getComments', verifyToken, getComments)

export default router;