const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    { timestamps: true }
);

const categoryModal = mongoose.model('categoryModal', categorySchema);
module.exports = categoryModal;