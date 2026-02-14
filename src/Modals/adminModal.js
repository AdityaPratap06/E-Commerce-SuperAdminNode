const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
        // validate: function () {
        //     return emailValidator.validate(this.email)
        // }
    },
    contact: {
        type: Number,
    },
    password: {
        type: String,
    },
    userToken: {
        type: String
    },
    databaseName: {
        type: String
    },
    verificationToken: String,
    resetToken: String
})

const adminModal = mongoose.model('adminModal', adminSchema);
module.exports = adminModal;