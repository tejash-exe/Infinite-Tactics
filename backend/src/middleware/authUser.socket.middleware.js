import User from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import 'dotenv/config';

const verifyJWTUser = async (socket, next) => {
    try {
        const rawCookies = socket.handshake.headers?.cookie;
        if (!rawCookies) throw new Error("No cookies found!");

        const cookies = cookie.parse(rawCookies);
        const accessToken = cookies.accessToken;
        if (!accessToken) throw new Error("No access token!");

        const token = await jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET);

        const user = await User.findById(token._id);
        if (!user) throw new Error("Invalid access token!");

        if (user.accessToken != accessToken) throw new Error("Different accessToken!");

        socket.user = user;
        next();
    } catch (error) {
        const err = new Error(error.message);
        err.data = new ApiResponse(469, error.message);
        next(err);
    };
};

export default verifyJWTUser;