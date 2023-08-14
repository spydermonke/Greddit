import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './Routes/Authrouter.js';
import userRoutes from './Routes/Userrouter.js';
import SubGredditRoutes from './Routes/SubGredditrouter.js';
import PostsRoutes from './Routes/Postsrouter.js';
import ModeratorRoutes from './Routes/Moderatorrouter.js';
import ReportRoutes from './Routes/ReportRoutes.js';
import SavePostRoutes from './Routes/SavePostRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
const port = process.env.PORT || 5000;
const url = process.env.MONGO_URL;
mongoose.set('strictQuery', true); // to avoid deprecation warning
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use("/subgreddit", SubGredditRoutes);
app.use("/posts", PostsRoutes);
app.use("/moderator", ModeratorRoutes);
app.use("/report", ReportRoutes);
app.use("/savepost", SavePostRoutes);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});