const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const user = require("../models/userDataBase");
const { accesToken, refreshToken } = require("../../config/service/accesToken");

const createUser = async (req, res) => {
    try {
        const { name, msv, password, checkpassword, phone } = req.body;

        // const allUser = await User.findOne({ email: req.body.email });
        if (!name || !msv || !password || !checkpassword || !phone) {
            return res.status(400).json({ message: "Error, Something wrong" });
        }
        if (password !== checkpassword) {
            return res.status(400).json({ message: "Your password is not correct" });
        }
        // if (allUser) {
        //     return res.status(400).json("email error");
        // }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const createUser = await new user({
            name,
            msv,
            password: hash,
            checkpassword: hash,
            phoneNumber: phone,
        });
        const user1 = await createUser.save();
        return res.status(200).json(user1);
    } catch (e) {
        return res.status(400).json({ message: e });
    }
};

const SignIn = async (req, res) => {
    console.log(req.body);
    try {
        const getUser = await user.findOne({ msv: req.body.msv });

        if (!getUser) {
            return res.status(400).json({ message: "msv not found" });
        }

        const checkPassword = await bcrypt.compareSync(req.body.password, getUser.password);
        if (!checkPassword) {
            return res.status(400).json({ message: req.body.password });
        }

        if (getUser && checkPassword) {
            const accToken = await accesToken({
                id: getUser._id,
                isAdmin: getUser.isAdmin,
            });
            const refreshTok = await refreshToken({
                id: getUser._id,
                isAdmin: getUser.isAdmin,
            });

            const { password, checkpassword, ...others } = getUser._doc;
            return res.status(200).json({ ...others, accToken, refreshTok });
        }
    } catch (e) {
        return res.status(400).json({ message: e });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const getUser = await user.updateOne({ _id: req.params.id }, req.body);
        return res.status(200).json({ message: "succesfull", getUser });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUser = await user.find();
        return res.status(200).json(allUser);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getUser = async (req, res) => {
    try {
        const human = await user.findOne({ _id: req.params.id });
        console.log(human);
        return res.status(200).json(human);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const moveUserToTrash = async (req, res) => {
    try {
        const user = await user.delete({ _id: req.params.id });
        const resultUser = res.status(200).json({ message: "successful" });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const punishUser = async (req, res) => {
    const { id, key } = req.params;

    try {
        const updatedUser = await user.findOneAndUpdate({ _id: id }, { punish: key });

        if (updatedUser) {
            return res.status(200).json({ message: " successfully." });
        } else {
            return res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        // Handle the error appropriately, e.g., send an error response

        res.status(500).json({ message: "Internal server error." });
    }
};
module.exports = {
    createUser,
    SignIn,
    UpdateUser,
    getAllUser,
    getUser,
    moveUserToTrash,
    punishUser,
};
