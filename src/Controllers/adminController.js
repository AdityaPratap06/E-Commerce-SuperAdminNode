const adminModal = require('../Modals/adminModal');
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const { transporter } = require('./mailTransporter');
const JWT_KEY = process.env.JWT_KEY;

module.exports.createAdmin = async function createAdmin(req, res) {
    try {
        const { name, userName, email, contact } = req.body;

        const existingUser = await adminModal.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const istTime = moment().tz("Asia/Kolkata").format();
        const plainPassword = crypto.randomBytes(6).toString("hex");
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        const safeUserName = userName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        const dbName = `admin_${safeUserName}`;
        const newDbConnection = mongoose.connection.useDb(dbName);
        await newDbConnection.collection("init").insertOne({ createdAt: new Date() });
        const admin = await adminModal.create({
            name,
            userName,
            email,
            contact,
            status: true,
            password: hashedPassword,
            databaseName: dbName,
            createdAt: istTime
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Admin Account Created",
            html: `
                <h2>Welcome ${name}</h2>
                <p>Your admin account has been created successfully.</p>
                <p><b>Username:</b> ${userName}</p>
                <p><b>Password:</b> ${plainPassword}</p>
                <p>Please login and change your password immediately.</p>
            `
        });
        const userDetails = _.omit(admin.toObject ? admin.toObject() : admin, ["_id", "id", "databaseName", "password"]);
        res.status(200).json({
            success: true,
            data: userDetails,
            message: 'Admin User Created Successfully'
        });
    } catch (error) {
        console.log('errr', error)
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.loginAdmin = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await adminModal.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                adminId: admin._id,
                databaseName: admin.databaseName
            },
            JWT_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            data: {
                id: admin._id,
                dbid: admin.id,
                name: admin.name,
                email: admin.email,
                userName: admin.userName,
                contact: admin.userName
            },
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports.adminAuth = async function (req, res, next) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Access denied" });
        }

        const decoded = jwt.verify(token, JWT_KEY);

        // Attach admin info to request
        req.admin = decoded;

        // Connect to admin specific database
        const adminDb = mongoose.connection.useDb(decoded.databaseName);
        req.adminDb = adminDb;

        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports.getAdminList = async function getAdminList(req, res) {
    try {
        let { page = 1, limit = 10, search = "" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const searchFilter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { userName: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const totalCount = await adminModal.countDocuments(searchFilter);

        const adminList = await adminModal
            .find(searchFilter)
            .select("-password -databaseName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: adminList,
            pagination: {
                totalRecords: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                pageSize: limit
            },
            message: "Admin list fetched successfully"
        });

    } catch (error) {
        console.log("Error fetching admin list:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
    }
};

module.exports.updateAdmin = async function updateAdmin(req, res) {
    try {
        const { adminId } = req.params;
        const updateData = { ...req.body };

        // Check admin exists
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (updateData.email && updateData.email !== admin.email) {
            const existingEmail = await adminModal.findOne({ email: updateData.email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        delete updateData._id;
        delete updateData.databaseName;
        delete updateData.createdAt;

        const updatedAdmin = await adminModal.findByIdAndUpdate(
            adminId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password -databaseName");

        res.status(200).json({
            success: true,
            data: updatedAdmin,
            message: "Admin updated successfully"
        });

    } catch (error) {
        console.log("Update admin error:", error);
        res.status(500).json({ success: false, message: "Internal server error", error });
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