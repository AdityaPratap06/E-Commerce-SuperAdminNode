const express = require("express");
const { createSubCategory } = require("../Controllers/subCategoryController");
const categoryRoutes = express.Router();

categoryRoutes.route("/").post(createSubCategory);
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