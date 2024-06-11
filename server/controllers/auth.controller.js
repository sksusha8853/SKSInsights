import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errHandler } from '../utils/error.js';
import exp from 'constants';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password} = req.body;
    if(!username || !email || !password || username === '' || email === '' || password === ''){
      return next(errHandler(400, 'All fields are required'));

    };

    const hashedPassword = bcryptjs.hashSync(password, 9);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });
    try {
        await newUser.save();
        res.json('SignUp Successful!');
    }
    catch(err){
        next(err);
    }
    
};

export const signin = async (req, res, next) => {
    const { email, password}= req.body;
    if(!email || !password || email ==='' || password === ''){
        return next(errHandler(400, 'All fields are required'));
    }
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errHandler(400, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errHandler(400, 'Incorrect password'));
        }
        const token = jwt.sign(
            {id: validUser._id, isAdmin: validUser.isAdmin}, 
            process.env.JWT_SECRET_TOKEN, {expiresIn: '30d'}
        );
        const {password:pass, ...rest} = validUser._doc;
        res.status(200).cookie('access_token', token, {
            httpOnly: true,

        })
        .json(rest);
        
    }
    catch(error){
        return next(error);
    } 
}

export const google = async (req, res, next) => {
    const {email, name, googlePhotoURL} = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET_TOKEN);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else {
            const newPassword = Math.random().toString(36).slice(-9) + Math.random().toString(36).slice(-9);
            const hashedPassword = bcryptjs.hashSync(newPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET_TOKEN); 
            const { password, ...rest } = newUser._doc; 
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error); 
    }
};
