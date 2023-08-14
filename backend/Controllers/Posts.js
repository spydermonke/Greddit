import Post from "../Models/Posts.js";
import SubGreddit from "../Models/SubGreddit.js";

export const getPosts = async (req, res) => {
    const { subgreddit_name } = req.body;
    try {
        const posts = await Post.find({ "subgreddit.name": subgreddit_name });
        const subgreddit = await SubGreddit.find({ name: subgreddit_name });
        const banned_keywords = subgreddit[0].banned_keywords;

        posts.forEach(posts => {
            banned_keywords.forEach(keyword => {
                const keyword_pattern = keyword;
                const keyword_re = new RegExp(keyword_pattern, "gi");

                const replaced = posts.title.replace(keyword_re, "*****");
                posts.title = replaced;
                

                const replaced_content = posts.content.replace(keyword_re, "*****");
                posts.content = replaced_content;
                
            });

        });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export const getPostbyId = async (req, res) => {
    const { post_id } = req.body;

    try {
        console.log(post_id)
        const post = await Post.findById(post_id);
        

        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }

}

export const createPost = async (req, res) => {
    const { title, content, posted_by, subgreddit } = req.body;

    try {
        const newPost = new Post({
            title,
            content,
            posted_by: {
                first_name: posted_by.first_name,
                last_name: posted_by.last_name,
                username: posted_by.username,
            },
            subgreddit: {
                name: subgreddit,
            },
            comments: [],
        });
        const subGreddit = await SubGreddit.find({ name: subgreddit });
        subGreddit[0].posts.push({ post_id: newPost._id, title: newPost.title });
        await subGreddit[0].save();
        subGreddit[0].posts_num = subGreddit[0].posts.length;
        await subGreddit[0].save();
        const post = await newPost.save();
        res.status(200).json(post);

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}