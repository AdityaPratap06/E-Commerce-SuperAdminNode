const adminModal = require("../Modals/adminModal");

module.exports.createSubCategory = async function createSubCategory(req, res) {
    try {
        const { adminId, name, categoryId } = req.body;

        // Get Admin
        const admin = await adminModal.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const dbConnection = mongoose.connection.useDb(admin.databaseName);

        const Category = dbConnection.model("Category");
        const SubCategory = dbConnection.model("SubCategory", SubCategorySchema);

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

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModal.find();
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

exports.updateCategory = async (req, res) => {
    try {
        const category = await categoryModal.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

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
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await categoryModal.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};