import mongoose from "mongoose";

const SavedPostSchema = new mongoose.Schema({
    saved_by: {
        type: {
            first_name: String,
            last_name: String,
            username: String,
        },
        required: true,
        trim: true,
        unique: true,
    },
    post_id: {
        type: [{
            type: String,
        }], 
        sparse: true,
        required: true,
        trim: true,
    },

}, { timestamps: true });

const SavedPost = mongoose.model("SavedPost", SavedPostSchema);
export default SavedPost;

