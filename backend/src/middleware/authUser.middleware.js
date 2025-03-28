import User from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import 'dotenv/config';

const verifyJWTUser = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!accessToken) throw new Error("No access token!");

        const token = await jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET);

        const user = await User.findById(token._id);
        if(!user) throw new Error("Invalid access token!");

        if(accessToken !== user.accessToken) throw new Error("Token does not match!");
        
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json(new ApiResponse(469, "Session expired!"));
    };
};

export default verifyJWTUser;