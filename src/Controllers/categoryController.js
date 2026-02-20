const categoryModal = require("../Modals/categoryModal");

module.exports.createCategory = async function createCategory(req, res) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const category = new categoryModal({
            name,
            description,
        });

        // If image uploaded
        if (req.file) {
            category.image.data = req.file.buffer;
            category.image.contentType = req.file.mimetype;
        }

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: {
                _id: category._id,
                name: category.name,
                description: category.description,
                hasImage: !!category.image?.data, // just indicator
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
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