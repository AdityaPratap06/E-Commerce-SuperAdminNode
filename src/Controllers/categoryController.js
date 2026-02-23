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
            category.image = req.file.filename;
        }
        console.log(category, req);

        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: {
                _id: category._id,
                name: category.name,
                description: category.description,
                image: req.file
                    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
                    : null,
                hasImage: !!category.image?.data,
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