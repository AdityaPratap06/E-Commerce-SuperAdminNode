const express = require("express");
const { createSubCategory, getAllSubCategories, updateSubCategory, deleteSubCategory } = require("../Controllers/subCategoryController");
const subCategoryRoutes = express.Router();

subCategoryRoutes.route("/create").post(createSubCategory);
subCategoryRoutes.route("/").get(getAllSubCategories);
subCategoryRoutes.route("/").patch(updateSubCategory);
subCategoryRoutes.route("/").delete(deleteSubCategory);

module.exports = subCategoryRoutes;