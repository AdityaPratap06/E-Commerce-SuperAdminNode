const express = require('express');
const { createAdmin, loginAdmin, getAdminList, updateAdmin } = require('../Controllers/adminController');
const adminRoutes = express.Router();

adminRoutes.route('/create').post(createAdmin);
adminRoutes.route('/login').post(loginAdmin);
adminRoutes.route('/list').get(getAdminList);
adminRoutes.route('/update/:adminId').patch(updateAdmin);

module.exports = adminRoutes;
