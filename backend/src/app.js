import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://infinite-tactics.vercel.app"],
    credentials: true,
}));

app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.static("public"));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://infinite-tactics.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

import socketHandler from "./routes/user.socket.routes.js";

socketHandler(io);

import userRouter from "./routes/user.routes.js";

app.use("/api/users", userRouter);

export { app, httpServer };