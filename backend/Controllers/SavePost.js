import SavedPost from "../Models/SavedPosts.js";
import Post from "../Models/Posts.js";
import SubGreddit from "../Models/SubGreddit.js";
import User from "../Models/User.js";


export const savePost = async (req, res) => {
    const { username, post_id, subgreddit_name } = req.body;
    try {
        const user = await User.findOne({ username: username });
        const savedPost = await SavedPost.findOne({ "saved_by.username": username });
        if (savedPost) {
            savedPost.post_id.push(post_id);
            // savedPost.subgreddit.name = subgreddit_name;
            await savedPost.save();
            res.status(200).json(savedPost);
        }
        else {
            const newSavedPost = new SavedPost({
                saved_by:
                {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                },
                // subgreddit: {
                //     name: subgreddit_name,
                // },
                post_id: [post_id],
            });
            const savedPost = await newSavedPost.save();
            res.status(200).json(savedPost);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSavePost = async (req, res) => {
    const { username } = req.body

    const savedposts = await SavedPost.find({ "saved_by.username": username })
    if(savedposts.length === 0) return res.status(200).json(savedposts)
    const savedPost = await Post.find({ _id: savedposts[0].post_id })
    res.status(200).json(savedPost)
}

export const removesavePost = async (req, res) => {
    const { username, post_id } = req.body;
    try {
        const savedPost = await SavedPost.findOne({ "saved_by.username": username });
        savedPost.post_id = savedPost.post_id.filter((id) => id !== post_id);
        await savedPost.save();
        res.status(200).json(savedPost);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}