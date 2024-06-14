import { errHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js"; // Ensure to import the Comment model
import User from "../models/user.model.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        // Ensure the userId in the request body matches the authenticated user's id
        if (userId !== req.user.id) {
            return next(errHandler(403, "You are not allowed to write your thoughts."));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        res.status(201).json(newComment); // It's more appropriate to use status 201 for creation
    } catch (error) {
        next(error);
    }
}


export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1, });
        res.status(201).json(comments);
    }
    catch (error) {
        next(error);
    }
}

export const getUser = async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.userId);
        if(!user){
            return next(errHandler(404, 'User not found'));
        }
        const {password, ...rest} = user._doc;
        res.status(200).json(rest);
    }
    catch(error){
        next(error);
    }
}

export const applaudComment = async (req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errHandler(403, 'Comment not found'));
        }
        const userIndex = comment.applauds.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfApplauds +=1;
            comment.applauds.push(req.user.id);
            
        }
        else{
            comment.numberOfApplauds -=1;
            comment.applauds.splice(userIndex, 1);

        }
        await comment.save();
        res.status(200).json(comment);
    }
    catch(error){
        next(error);
    }
}

export const editComment  = async (req, res,next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errHandler(404, 'Comment not found.'));
        }
        if(comment.userId != req.user.id){
            return next(errHandler(403, 'You are not allowed to edit this comment'));
        }
        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            {new: true}
        );
        res.status(200).json(editComment);
    }
    catch(error){
        next(error);
    }
}

export const deleteComment = async(req, res, next)=>{
    try{
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return next(errHandler(404, 'Comment not found.'));
        }
        if(comment.userId != req.user.id && !req.user.isAdmin){
            return next(errHandler(403, 'You are not allowed to edit this comment'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json("Comment has been deleted.");


    }catch(error){
        next(error);
    }
}