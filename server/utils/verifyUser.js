import jwt from "jsonwebtoken";
import { errHandler} from '../utils/error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(errHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (error, user) => {
        if(error){
            return next(errHandler(401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });
}