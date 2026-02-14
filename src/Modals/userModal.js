const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: {
        type: String,
    },
    password: {
        type: String,
    },
    userToken: {
        type: String
    },
    verificationToken: String,
    resetToken: String
})

const userModal = mongoose.model('userModal', userSchema);
module.exports = userModal;