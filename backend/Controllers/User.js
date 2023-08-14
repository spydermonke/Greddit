import User from "../Models/User.js";
import jwt from 'jsonwebtoken';

/* READ */
// export const getUser = async (req, res) => {

//   const { id } = req.params;
//   const user = await User.findById(id);
//   res.status(200).json(user);

// };

export const getAllUsers = async (req, res) => {
  const all_users = await User.find({});
  res.status(200).json(all_users);
};

export const updateUserprofile = async (req, res) => {
  const { newData } = req.body;
  const user = await User.findOne({ username: newData.username });

  if (user) {
    user.contact_number = newData.contact_number;
    user.user_description = newData.user_description;
    user.age = newData.age;
    user.first_name = newData.first_name;
    user.last_name = newData.last_name;

    await user.save()

    const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, username: user.username, contact_number: user.contact_number, age: user.age, followers_num: user.followers_num, followings_num: user.followings_num, user_description: user.user_description }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token });

  }

};

export const getUserFollowers = async (req, res) => {

  const { username } = req.body;
  const user = await User.findOne({ username: username });

  if (user) {
    const followers = await Promise.all(
      user.followers)

    const formattedFollowers = followers.map(
      ({ first_name, last_name, username }) => {
        return { first_name, last_name, username };
      }
    );



    res.status(200).json(formattedFollowers);
  }

};

export const Remove = async (req, res) => {
  const { username, followers_username } = req.body;
  const user = await User.findOne({ username: username });
  const followers_user = await User.findOne({ username: followers_username });

  if (user && followers_user) {
    user.followers = user.followers.filter((followers) => followers.username !== followers_username);
    followers_user.followings = followers_user.followings.filter((followings) => followings.username !== username);
    user.followers_num = user.followers.length;
    followers_user.followings_num = followers_user.followings.length;

    await user.save();
    await followers_user.save();

    const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, username: user.username, contact_number: user.contact_number, age: user.age, followers_num: user.followers_num, followings_num: user.followings_num, user_description: user.user_description }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token });


    // return res.status(200).json(user);
  }

};

export const getUserFollowing = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username: username });

  if (user) {
    const followings = await Promise.all(
      user.followings );
    const formattedFollowings = followings.map(
      ({ first_name, last_name, username }) => {
        return { first_name, last_name, username };
      }
    );



    res.status(200).json(formattedFollowings);
  }
}

export const Unfollow = async (req, res) => {
  const { username, following_username } = req.body;
  const user = await User.findOne({ username: username });
  const following_user = await User.findOne({ username: following_username });

  if (user && following_user) {
    user.followings = user.followings.filter((followings) => followings.username !== following_username);
    following_user.followers = following_user.followers.filter((followers) => followers.username !== username);
    user.followings_num = user.followings.length;
    following_user.followers_num = following_user.followers.length;

    await user.save();
    await following_user.save();

    const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, username: user.username, contact_number: user.contact_number, age: user.age, followers_num: user.followers_num, followings_num: user.followings_num, user_description: user.user_description }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token });


    // return res.status(200).json(user);
  }
}

export const getPotentialFollowings = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username: username });

  if (user) {
    const all_users = await User.find({});
    const potential_followings = all_users.filter((tempuser) => user.followings.filter((following) => following.username === tempuser.username).length === 0);
    const potential_followings_1 = potential_followings.filter((tempuser) => tempuser.username !== username);
    const formattedPotentialFollowings = potential_followings_1.map(
      ({ first_name, last_name, username }) => {
        return { first_name, last_name, username };
      }
    );

    res.status(200).json(formattedPotentialFollowings);


  }

}

export const Follow = async (req, res) => {
  const { username, potential_following_username } = req.body;
  const user = await User.findOne({ username: username });
  const following_user = await User.findOne({ username: potential_following_username });

  // new stuff
  user.followings = user.followings.filter((followings) => followings.username !== potential_following_username);
  following_user.followers = following_user.followers.filter((followers) => followers.username !== username);

  if(user && following_user){
    user.followings.push({
      first_name: following_user.first_name,
      last_name: following_user.last_name,
      username: following_user.username
    });
    following_user.followers.push({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username
    });

    user.followings_num = user.followings.length;
    following_user.followers_num = following_user.followers.length;

    //new stuff
    user.followings = user.followings.filter((followings) => followings.username !== username);
    following_user.followers = following_user.followers.filter((followers) => followers.username !== potential_following_username);

    await user.save();
    await following_user.save();

    const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, username: user.username, contact_number: user.contact_number, age: user.age, followers_num: user.followers_num, followings_num: user.followings_num, user_description: user.user_description }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token });

    // return res.status(200).json(user);
  }

}


