import { errHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'; 

export const test = (req, res) => {
    res.json({ message: 'API is working fine!' });
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errHandler(403, 'You are not allowed to update this user.'));
    }

    const updates = {};
    if (req.body.password) {
        if (req.body.password.length < 8) {
            return next(errHandler(400, 'Password must be at least 8 characters.'));
        }
        updates.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 6 || req.body.username.length > 20) {
            return next(errHandler(400, 'Username must be between 6 and 20 characters'));
        }
        if (!req.body.username.match(/^[a-z0-9]+$/)) {
            return next(errHandler(400, 'Username can only contain lowercase letters and numbers.'));
        }
        updates.username = req.body.username;
    }
    if (req.body.email) {
        updates.email = req.body.email;
    }
    if (req.body.profilePicture) {
        updates.profilePicture = req.body.profilePicture;
    }

    if (Object.keys(updates).length === 0) {
        return next(errHandler(400, 'No valid fields to update.'));
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: updates },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
