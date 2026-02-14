// userController.js
const adminModal = require('../Modals/adminModal');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const JWT_KEY = process.env.JWT_KEY;
// const emailValidator = require('email-validator');
const mongoose = require("mongoose");

module.exports.createAdmin = async function createAdmin(req, res) {
    try {
        const { name, userName, email, contact } = req.body;

        // if (!emailValidator.validate(email)) {
        //     return res.status(400).json({ message: 'Invalid email address' });
        // }

        const existingUser = await adminModal.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const plainPassword = crypto.randomBytes(6).toString("hex");
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        // const dbName = admin_${ Date.now()
        const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const dbName = `admin_${safeUserName}`;
        const newDbConnection = mongoose.connection.useDb(dbName);
        await newDbConnection.collection("init").insertOne({ createdAt: new Date() });
        const admin = await adminModal.create({
            name,
            userName,
            email,
            contact,
            password: hashedPassword,
            databaseName: dbName
        });

        res.status(200).json({
            data: admin,
            // {
            //     name: name,
            //     contact: contact,
            //     email: email,
            // },
            message: 'Admin User Created Successfully'
        });
    } catch (error) {
        console.log('errr', error)
        res.status(500).json({ error });
    }
};

// module.exports.login = async function login(req, res) {
//     try {
//         let data = req.body;
//         if (data.userName) {
//             let user = await userModal.findOne({ userName: data.userName })

//             if (user) {

//                 let hashedPassword = await bcrypt.hash(data.password, user.userToken);
//                 if (user.password == hashedPassword) {
//                     let uid = user["_id"];
//                     // let token = jwt.sign({ payload: uid }, JWT_KEY);
//                     let token = jwt.sign({ payload: uid }, REFRESH_SECRET, { expiresIn: "7d" });
//                     // res.cookie("login", token, { httpOnly: true });
//                     res.cookie("login", token, {
//                         httpOnly: true,
//                         secure: process.env.NODE_ENV === "production",
//                         sameSite: "Strict",
//                         maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//                     });
//                     const userDetails = _.omit(user.toObject ? user.toObject() : user, ["_id", "id", "userToken", "password"]);
//                     return res.json({
//                         message: "User LoggedIn Successfully",
//                         data: { userDetails, token }
//                     })
//                 }
//                 else {
//                     return res.json({
//                         message: "Wrong credential."
//                     })
//                 }
//             }
//             else {
//                 return res.json({
//                     message: "User not found."
//                 })
//             }
//         }
//         else {
//             return res.json({
//                 message: "Something Went Wrong."
//             })
//         }
//     }
//     catch (err) {
//         return res.json({
//             message: err.message
//         })

//     }
// }

// module.exports.updatePassword = async function
//     updatePassword(req, res) {
//     try {
//         const { userName, password } = req.body;

//         const user = await userModal.findOne({ userName });

//         if (user) {
//             let hashedPassword = await bcrypt.hash(password, user.userToken);
//             await userModal.findOneAndUpdate(
//                 { userName: userName },
//                 { $set: { password: hashedPassword } },
//                 { new: true }
//             );
//             return res.status(200).json({
//                 data: user,
//                 message: "Password update successfully"
//             })
//         }
//         else {
//             return res.status(404).json({ error: 'User not found. Please sign up first.' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

// module.exports.refreshToken = async function (req, res) {
//     try {
//         const refreshToken = req.cookies.refreshToken;
//         if (!refreshToken) {
//             return res.status(401).json({ message: "No refresh token provided" });
//         }

//         const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
//         console.log(decoded);

//         // Optional: validate user ID from token exists
//         const newAccessToken = jwt.sign({ payload: decoded.payload }, JWT_KEY, { expiresIn: '7d' });

//         res.cookie("login", newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "Strict",
//             maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//         });
//         console.log(refreshToken, newAccessToken);

//         return res.status(200).json({ token: newAccessToken });
//     } catch (err) {
//         return res.status(403).json({ message: "Invalid refresh token" });
//     }
// };