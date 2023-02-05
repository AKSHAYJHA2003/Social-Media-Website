import express from 'express';
const index = express();

import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/post.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from './models/Post.js';
import { users , posts } from "./data/index.js";


import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { verifyToken } from './middleware/auth.js';
mongoose.connect(
    process.env.MONGO_URL
).then(() => {
    console.log('DB Connection Successful!')
}).catch((err) => {
    console.log(err);
})

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(cors());
app.use( "/assets", express.static(path.join(__dirname, 'public/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, "public/assets");
    },
    filename: function( req, file, cb) {
        cb( null, file.originalname);
    }
});
const upload = multer ( { storage });
/**Routes with Files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/**routes */
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);




app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running fine port : ${process.env.PORT}`);
    //User.insertMany(users);
    //Post.insertMany(posts);
});