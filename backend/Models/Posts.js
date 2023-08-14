import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    posted_by: {
        type: {
            first_name: String,
            last_name: String,
            username: String,
        },
        required: true,
        trim: true,
    },
    subgreddit: {
        type: {
            name: String,
        },
        required: true,
        trim: true,
    },
    upvotes: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    upvoted_by: {
        type: [{
            username: String,
        }], sparse: true
    },
    downvoted_by: {
        type: [{
            username: String,
        }], sparse: true
    },
    downvotes: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    comments: {
        type: [{
            content: String, // even though id, too lazy to change schema, so gonna just put comments
            posted_by: {
                username: String,
                first_name: String,
                last_name: String,
            },

        }], sparse: true
    },

    comments_num: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    // delete this if gives trouble
    blocked: {
        type: Boolean,
        required: true,
        trim: true,
        default: false,
    }

}, { timestamps: true });


const Post = mongoose.model("Post", PostSchema);
export default Post;

