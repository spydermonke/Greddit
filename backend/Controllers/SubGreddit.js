import SubGreddit from "../Models/SubGreddit.js";
import User from "../Models/User.js";
import Post from "../Models/Posts.js";
import Reports from "../Models/Reports.js";
import SavedPost from "../Models/SavedPosts.js";


// in this I have used subGreddit[0] because I am getting an array of objects and I want to access the first object in the array. not findOne or anything else
export const createSubGreddit = async (req, res) => {

    try 
    {

    const { name, description, tags, banned_keywords, moderator } = req.body;

    const newSubGreddit = new SubGreddit({
        name,
        description,
        tags,
        banned_keywords,
        moderator: [
            {
                first_name: moderator.first_name,
                last_name: moderator.last_name,
                username: moderator.username,
            }
        ],
        members: [{
            first_name: moderator.first_name,
            last_name: moderator.last_name,
            username: moderator.username,
        }],
        members_num_change: [
            {
                date: new Date(),
                num: 1,
            }
        ],
        posts: [],
        blocked_users: [],
        requested_user: [],
        reported_posts: [],
    });

    const subGreddit = await newSubGreddit.save();
    res.status(200).json(subGreddit);
}
catch (error) {
    res.status(500).json({ error: error.message });
}

}

export const mySubGreddits = async (req, res) => {
    try {
        const { username } = req.body;
        const subGreddits = await SubGreddit.find({ "moderator.username": username });
        res.status(200).json(subGreddits);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const allSubGreddits = async (req, res) => {
    const { username } = req.body;
    
    try {
        const subGreddits_joined = await SubGreddit.find({ "members.username": username });
        const subGreddits_all = await SubGreddit.find();
        const subGreddits = subGreddits_joined.concat(subGreddits_all);
        const subGreddits_uniq = subGreddits.filter((subGreddit, index, self) =>
            index === self.findIndex((t) => (
                t.name === subGreddit.name
            ))
        );

    

        
        res.status(200).json(subGreddits_uniq);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserStatus = async (req, res) => {
    try {
        const { username, subgreddit_name } = req.body;
        const subGreddit = await SubGreddit.find({ name: subgreddit_name });
        const moderator = subGreddit[0].moderator.filter((moderator) => moderator.username === username);
        const member = subGreddit[0].members.filter((member) => member.username === username);
        const blocked_users = subGreddit[0].blocked_users.filter((blocked_user) => blocked_user.username === username);
        const requested_user = subGreddit[0].requested_user.filter((requested_user) => requested_user.username === username);
        if (moderator.length > 0) {
            res.status(200).json({ status: "moderator" });
        }
        else if (member.length > 0) {
            res.status(200).json({ status: "member" });
        }
        else if (blocked_users.length > 0) {
            res.status(200).json({ status: "blocked" });
        }
        else if (requested_user.length > 0) {
            res.status(200).json({ status: "requested" });
        }
        else {
            res.status(200).json({ status: "normal_user" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSubGredditInfo = async (req, res) => {
    const { subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    res.status(200).json(subGreddit);
}

export const LeaveSubGreddit = async (req, res) => {
    const { username, subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    const user = await User.findOne({ username: username });
    subGreddit[0].members = subGreddit[0].members.filter((member) => member.username !== username);
    subGreddit[0].members_num = subGreddit[0].members.length;
    subGreddit[0].blocked_users.push({
        username: username,
        first_name: user.first_name,
        last_name: user.last_name,
    })
    await subGreddit[0].save();
    subGreddit[0].members_num_change.push(
        {
            date: new Date(),
            num: subGreddit[0].members.length,
        }
    )

    await subGreddit[0].save();
    res.status(200).json(subGreddit);
}

export const JoinSubGreddit = async (req, res) => {
    const { username, first_name, last_name, subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    subGreddit[0].requested_user.push({
        username: username,
        first_name: first_name,
        last_name: last_name,
    });


    await subGreddit[0].save();
    res.status(200).json(subGreddit);
}

export const deleteSubGreddits = async (req, res) => {
    const { subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });

    const posts = await Post.find({ "subgreddit.name": subgreddit_name });
    const post_id = posts.map((post) => post._id);

    await SavedPost.deleteMany({ "post_id": { $in: post_id } });
    await Post.deleteMany({ "subgreddit.name": subgreddit_name });
    await Reports.deleteMany({ "in_subgreddit.name": subgreddit_name });
    await SubGreddit.deleteOne({ name: subgreddit_name });
    res.status(200).json(subGreddit);


}

export const upVotePost = async (req, res) => {
    const { username, post_id } = req.body;
    const post = await Post.find({ _id: post_id });



    if(post[0].upvoted_by.filter((user) => user.username === username).length > 0) {
        post[0].upvoted_by = post[0].upvoted_by.filter((user) => user.username !== username);
        post[0].upvotes = post[0].upvoted_by.length;
        await post[0].save();
        res.status(200).json(post);
    }
    else{
        post[0].upvoted_by.push({
            username: username,
        });
        post[0].upvotes = post[0].upvoted_by.length;
        post[0].downvoted_by = post[0].downvoted_by.filter((user) => user.username !== username);
        post[0].downvotes = post[0].downvoted_by.length;
        await post[0].save();
        res.status(200).json(post);
    }    
}

export const downVotePost = async (req, res) => {

    const { username, post_id } = req.body;
    const post = await Post.find({ _id: post_id });

    if(post[0].downvoted_by.filter((user) => user.username === username).length > 0) {
        post[0].downvoted_by = post[0].downvoted_by.filter((user) => user.username !== username);
        post[0].downvotes = post[0].downvoted_by.length;
        await post[0].save();
        res.status(200).json(post);
    }
    else{
        post[0].downvoted_by.push({
            username: username,
        });
        post[0].downvotes = post[0].downvoted_by.length;
        post[0].upvoted_by = post[0].upvoted_by.filter((user) => user.username !== username);
        post[0].upvotes = post[0].upvoted_by.length;
        await post[0].save();
        res.status(200).json(post);
    }

}

export const addComment = async (req, res) => {

    const { username, post_id, comment } = req.body;
    const user = await User.find({ username: username });
    const post = await Post.find({ _id: post_id });
    post[0].comments.push({
        content: comment,
        posted_by: {
            username: username,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
        },
        }
    )

    post[0].comments_num = post[0].comments.length;

    await post[0].save();
    res.status(200).json(post);
}
