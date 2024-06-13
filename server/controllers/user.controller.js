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

export const deleteUser = async (req, res, next) => {
    if (req.user.id != req.params.userId) {
        return next(errHandler(404, 'You are not allowed to delete this account.'));

    }
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('Account deleted.');
    }
    catch (err) {
        next(err);
    }
}

export const signout = (req, res, next) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('Signed Out Successfully.');
    }
    catch (err) {
        next(err);
    }
};

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errHandler(403, "You are not allowed to see all users."));
    }

    try {
        const startIndex = parseInt(req.query.startIndex, 10) || 0;
        const limit = parseInt(req.query.limit, 10) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsersCount = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsersCount,
        });
    } catch (error) {
        next(error);
    }
};