// userController.js
const userModal = require('../Modals/userModal');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_KEY = process.env.JWT_KEY;

module.exports.login = async function login(req, res) {
    try {
        let data = req.body;
        if (data.userName) {
            let user = await userModal.findOne({ userName: data.userName })

            if (user) {

                let hashedPassword = await bcrypt.hash(data.password, user.userToken);
                if (user.password == hashedPassword) {
                    let uid = user["_id"];
                    // let token = jwt.sign({ payload: uid }, JWT_KEY);
                    let token = jwt.sign({ payload: uid }, REFRESH_SECRET, { expiresIn: "7d" });
                    // res.cookie("login", token, { httpOnly: true });
                    res.cookie("login", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "Strict",
                        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
                    });
                    const userDetails = _.omit(user.toObject ? user.toObject() : user, ["_id", "id", "userToken", "password"]);
                    return res.json({
                        message: "User LoggedIn Successfully",
                        data: { userDetails, token }
                    })
                }
                else {
                    return res.json({
                        message: "Wrong credential."
                    })
                }
            }
            else {
                return res.json({
                    message: "User not found."
                })
            }
        }
        else {
            return res.json({
                message: "Something Went Wrong."
            })
        }
    }
    catch (err) {
        return res.json({
            message: err.message
        })

    }
}

module.exports.updatePassword = async function
    updatePassword(req, res) {
    try {
        const { userName, password } = req.body;

        const user = await userModal.findOne({ userName });

        if (user) {
            let hashedPassword = await bcrypt.hash(password, user.userToken);
            await userModal.findOneAndUpdate(
                { userName: userName },
                { $set: { password: hashedPassword } },
                { new: true }
            );
            return res.status(200).json({
                data: user,
                message: "Password update successfully"
            })
        }
        else {
            return res.status(404).json({ error: 'User not found. Please sign up first.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.refreshToken = async function (req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
        console.log(decoded);

        // Optional: validate user ID from token exists
        const newAccessToken = jwt.sign({ payload: decoded.payload }, JWT_KEY, { expiresIn: '7d' });

        res.cookie("login", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
        });
        console.log(refreshToken, newAccessToken);

        return res.status(200).json({ token: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};