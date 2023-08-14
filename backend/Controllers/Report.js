import Reports from "../Models/Reports.js";
import User from "../Models/User.js";
import SubGreddit from "../Models/SubGreddit.js";
import Post from "../Models/Posts.js";


export const createReport = async (req, res) => {
    const { reported_by_username, in_subgreddit, poster, reported_post, reason , post_content } = req.body;
    const reported_by = await User.findOne({username:reported_by_username})
    try {
        const newReport = new Reports({
            reported_by: {
                first_name: reported_by.first_name,
                last_name: reported_by.last_name,
                username: reported_by.username,
            },
            in_subgreddit: {
                name: in_subgreddit,
            },
            poster: {
                first_name: poster.first_name,
                last_name: poster.last_name,
                username: poster.username,
            },
            reported_post: {
                post_id: reported_post,
            },
            reason : reason,
            post_content: post_content,
        });
        const report = await newReport.save();

        const subgreddit = await SubGreddit.findOne({ name: in_subgreddit });
        subgreddit.reported_posts_num += 1;
        await subgreddit.save();
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}



