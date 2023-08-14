import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';


export const register = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        username,
        password,
        contact_number,
        age,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const new_User = new User({
        first_name,
        last_name,
        email,
        username,
        password: passwordHash,
        contact_number,
        age,
        followers_num: 0,
        followings_num: 0,
        followers: [],
        followings: [],
        user_description: "Ae Roopali, Pakad meri Daali, Yo Yo bantai Rapper",
    });
    const save_User = await new_User.save();
    res.status(201).json(save_User);
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
        return res.status(400).json({ error: "User does not exist. " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials. " });
    }

    // return res.status(200).json({ msg: "Login successful. " });

    const token = jwt.sign({ id: user._id, first_name: user.first_name, last_name: user.last_name, email: user.email, username: user.username, contact_number: user.contact_number, age: user.age, followers_num: user.followers_num, followings_num: user.followings_num, user_description: user.user_description }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token });
};