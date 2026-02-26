const mongoose = require("mongoose");
const adminModal = require("../Modals/adminModal");
const subCategorySchema = require("../Modals/subCategoryModal");
const adminCategorySchema = require("../Modals/adminCategoryModal");

module.exports.createSubCategory = async function createSubCategory(req, res) {
    try {
        const { adminId, name, categoryId } = req.body;

        // Get Admin
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const dbConnection = mongoose.connection.useDb(admin.databaseName);

        const Category = dbConnection.model("admincategories", adminCategorySchema);
        const SubCategory = dbConnection.model("SubCategory", subCategorySchema);

        // Check if category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ message: "Category not found" });
        }

        const subCategory = await SubCategory.create({
            name,
            categoryId
        });

        res.status(200).json({
            success: true,
            data: subCategory,
            message: "SubCategory created successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const adminId = req.params.adminId;

        // 1️⃣ Find admin
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 2️⃣ Switch DB
        const dbConnection = mongoose.connection.useDb(admin.databaseName);

        const Category = dbConnection.model("admincategories", adminCategorySchema);
        dbConnection.model("subcategories", subCategorySchema);

        // 3️⃣ Aggregate categories with subcategories
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: "subcategories", // collection name in lowercase & plural (check your actual collection name)
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subCategories"
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryModal.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateSubCategory = async (req, res) => {
    try {
        const { adminId, subCategoryId, name, categoryId } = req.body;

        // 1️⃣ Check admin
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 2️⃣ Switch DB
        const dbConnection = mongoose.connection.useDb(admin.databaseName);
        const SubCategory = dbConnection.model("SubCategory", subCategorySchema);

        // 3️⃣ Find subcategory
        const subCategory = await SubCategory.findById(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        const updated = await SubCategory.findByIdAndUpdate(
            subCategoryId,
            { name, categoryId },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "SubCategory updated successfully",
            data: updated
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteSubCategory = async (req, res) => {
    try {
        const { adminId, subCategoryId } = req.body;

        // 1️⃣ Check admin
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // 2️⃣ Switch DB
        const dbConnection = mongoose.connection.useDb(admin.databaseName);
        const SubCategory = dbConnection.model("SubCategory", subCategorySchema);

        // 3️⃣ Delete subcategory
        const deletedSubCategory = await SubCategory.findByIdAndDelete(subCategoryId);

        if (!deletedSubCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        res.status(200).json({
            success: true,
            message: "SubCategory deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};