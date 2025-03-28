import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Error! Must include name'],
    },
    email: {
        type: String,
        required: [true, 'Error! Must include email'],
    },
    picture: {
        type: String,
    },
    score: {
        type: String,
        default: "0",
    },
    accessToken: {
        type: String,
        default: "",
    },
}, { timestamps: true });

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            picture: this.picture,
            score: this.score,
        },
        process.env.USER_ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.USER_ACCESS_TOKEN_EXPIRY,
        }
    )
};

const User = mongoose.model('User', userSchema);

export default User;