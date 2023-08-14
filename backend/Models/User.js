import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    contact_number: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    followers_num: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    followings_num: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    followers: {
        type: [{
            first_name: String,
            last_name: String,
            username: String,
        }], sparse: true
    },
    followings: {
        type: [{
            first_name: String,
            last_name: String,
            username: String,
        }], sparse: true
    },
    user_description: {
        type: String,
        default: "Ae Roopali, Pakad meri Daali, Yo Yo bantai Rapper",
    }
},
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;