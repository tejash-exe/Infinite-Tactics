import User from "../models/User.model.js";
import options from "../utils/CookiesOptions.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import oauth2client from "../utils/googleConfig.js";
import 'dotenv/config';

const generateAccessToken = async (userid) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            throw new Error("User not found!");
        };

        const accessToken = await user.generateAccessToken();

        user.accessToken = accessToken;

        const savedUser = await user.save({ validateBeforeSave: false });
        if (!savedUser) throw new Error("Cannot save user while generating tokens!!");

        return accessToken;
    } catch (error) {
        throw new Error(error.message);
    };
};

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`, { method: 'GET' });

        const response = await userRes.json();
        console.log(response);

        const { name, email, picture } = response;

        let user = await User.findOne({ email : email });
        if(user){
            user.name = name;
            user.picture = picture.toString();

            user = await user.save();
            if(!user) throw new Error("Cannot able to save user!!");
        }
        else{
            user = await User.create({
                name: name,
                email: email,
                picture: picture,
            });
            if(!user) throw new Error("Cannot able to create new user!!");
        }

        const accessToken = await generateAccessToken(user?._id);

        const loggedInUser = await User.findById(user._id).select(" -accessToken ").lean();
        if (!loggedInUser) throw new Error("Cannot find user!!");

        console.log(loggedInUser.name + " logged in!");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

        res
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, "Logged in Succesfully!", {
                user: loggedInUser,
            }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const logout = async (req, res) => {
    try {
        //Find and delete tokens
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    refreshToken: "",
                },
            },
            {
                new: true,
            });

        if (!user) {
            throw new Error("Cannot find user!");
        };

        res
            .clearCookie("accessToken", options)
            .json(new ApiResponse(200, "Logged out Succesfully!"));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const refreshScore = async (req, res) => {
    try {
        res.json(new ApiResponse(200, "Score fetched successfully!", { score: req.user.score }));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const fetchLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
        .select(' -accessToken ')
        .sort({ score: -1, createdAt: 1 }) 
        .exec();
        
        res.json(new ApiResponse(200, "Leaderboard fetched successfully!", users));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

export {
    googleLogin,
    logout,
    refreshScore,
    fetchLeaderboard,
};