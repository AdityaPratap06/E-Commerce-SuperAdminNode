const express = require("express");
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../Controllers/categoryController");
const categoryRoutes = express.Router();

categoryRoutes.route("/").post(createCategory);
categoryRoutes.route("/").get(getAllCategories);
categoryRoutes.route("/:id").get(getCategoryById);
categoryRoutes.route("/:id").put(updateCategory);
categoryRoutes.route("/:id").delete(deleteCategory);

module.exports = categoryRoutes;

// {
//   "name": "Electronics",
//   "description": "All electronic items",
//   "image": "https://example.com/image.jpg"
// }