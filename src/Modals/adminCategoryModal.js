const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
    { timestamps: true }
);

// const adminCategoryModal = mongoose.model('adminCategoryModal', adminCategorySchema);
module.exports = adminCategorySchema;