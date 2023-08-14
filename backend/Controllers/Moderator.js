import SubGreddit from "../Models/SubGreddit.js";
import Reports from "../Models/Reports.js";
import Post from "../Models/Posts.js"

export const UserList = async (req, res) => {
    const { subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    const moderator = subGreddit[0].moderator;
    const members = subGreddit[0].members;
    const blocked_users = subGreddit[0].blocked_users;

    res.status(200).json({ moderator, members, blocked_users });
}

export const JoiningRequest = async (req, res) => {

    const { subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    const requested_user = subGreddit[0].requested_user;
    res.status(200).json(requested_user);

}

export const AcceptJoiningRequest = async (req, res) => {
    const { subgreddit_name, username, first_name, last_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    subGreddit[0].members.push({ first_name, last_name, username });
    subGreddit[0].requested_user = subGreddit[0].requested_user.filter((user) => user.username !== username);
    subGreddit[0].members_num = subGreddit[0].members.length;
    await subGreddit[0].save();
    subGreddit[0].members_num_change.push(
        {
            date: new Date(),
            num: subGreddit[0].members.length,
        }
    )
    await subGreddit[0].save();

    res.status(200).json({ message: "User added to the subgreddit" });
}

export const RejectJoiningRequest = async (req, res) => {
    const { subgreddit_name, username } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });
    subGreddit[0].requested_user = subGreddit[0].requested_user.filter((user) => user.username !== username);
    await subGreddit[0].save();
    res.status(200).json({ message: "User rejected" });
}

export const ReportedPosts = async (req, res) => {
    const { in_subgreddit } = req.body;
    const reported_posts = await Reports.find({ "in_subgreddit.name": in_subgreddit });
    res.status(200).json(reported_posts);
}

export const deleteReportedPost = async (req, res) => {
    const { report_id } = req.body;

    try {
        const report = await Reports.findById(report_id);
        const post = await Post.findById(report.reported_post.post_id);
        
        const subGreddit = await SubGreddit.find({ name: report.in_subgreddit.name });
        await post.delete();
        subGreddit[0].posts = subGreddit[0].posts.filter((post) => post.post_id !== report.reported_post.post_id);
        subGreddit[0].posts_num = subGreddit[0].posts.length;
        subGreddit[0].deleted_posts_num += 1;
        await subGreddit[0].save();
        await Reports.deleteMany({ "reported_post.post_id": post._id });
        res.status(200).json({ message: "Post deleted" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const blockReportedPost = async (req, res) => {
    const { report_id } = req.body;
    const report = await Reports.findById(report_id);
    const post = await Post.findById(report.reported_post.post_id);
    post.blocked = true;
    await post.save();
    report.status = "Blocked";
    await report.save();
    res.status(200).json({ message: "Poster blocked" });

}

export const ignoreReportedPost = async (req, res) => {
    const { report_id } = req.body;
    const report = await Reports.findById(report_id);
    report.status = "Ignored";
    console.log(report)
    await report.save();
    res.status(200).json({ message: "Report ignored" });
}

export const unignoreReportedPost = async (req, res) => {
    const { report_id } = req.body;
    const report = await Reports.findById(report_id);
    report.status = "pending";
    console.log(report)
    await report.save();
    res.status(200).json({ message: "Report unignored" });
}

export const stats = async (req, res) => {
    const { subgreddit_name } = req.body;
    const subGreddit = await SubGreddit.find({ name: subgreddit_name });

    const members_num_change = subGreddit[0].members_num_change;
    const members_grouped = members_num_change.map((member) => {
        return {
            date: member.date.toDateString(),
            num: member.num
        }
    })

    const members_groupbydate = members_grouped.reduce((acc, obj) => {
        const key = obj.date;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});

    // Object.keys is used for mapping, uske bina dikkat
    const members_groupbydate_num = Object.keys(members_groupbydate).map((key) => {
        return {
            date: key,
            num: members_groupbydate[key][members_groupbydate[key].length - 1].num
        }
    })


        
    const posts = await Post.find({ "subgreddit.name": subgreddit_name });
    
    const posts_grouped = posts.map((post) => {
        return {
            date: post.createdAt.toDateString(),
            post_id: post._id
        }
    })

    const posts_groupbydate = posts_grouped.reduce((acc, obj) => {
        const key = obj.date;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});

    // Object.keys is used for mapping, uske bina dikkat
    const posts_groupbydate_num = Object.keys(posts_groupbydate).map((key) => {
        return {
            date: key,
            num: posts_groupbydate[key].length
        }
    })

    let reportstat = { reported_posts_num: subGreddit[0].reported_posts_num, deleted_posts_num: subGreddit[0].deleted_posts_num };

    // console.log(members_groupbydate_num, posts_groupbydate_num, reportstat)

    res.status(200).json({ members_groupbydate_num, posts_groupbydate_num, reportstat });

}



