import { errHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js"; // Ensure to import the Comment model

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
