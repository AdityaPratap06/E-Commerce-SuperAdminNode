const express = require("express");
const { createSubCategory } = require("../Controllers/subCategoryController");
const subCategoryRoutes = express.Router();

subCategoryRoutes.route("/create").post(createSubCategory);
// subCategoryRoutes.route("/").get(getAllCategories);
// subCategoryRoutes.route("/:id").get(getCategoryById);
// subCategoryRoutes.route("/:id").put(updateCategory);
// subCategoryRoutes.route("/:id").delete(deleteCategory);

module.exports = subCategoryRoutes;

// {
//   "name": "Electronics",
//   "description": "All electronic items",
//   "image": "https://example.com/image.jpg"
// }