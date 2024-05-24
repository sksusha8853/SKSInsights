import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errHandler } from '../utils/error.js';

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