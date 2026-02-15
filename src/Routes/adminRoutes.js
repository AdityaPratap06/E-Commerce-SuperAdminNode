const express = require('express');
const { createAdmin, loginAdmin } = require('../Controllers/adminController');
const adminRoutes = express.Router();

adminRoutes.route('/create').post(createAdmin);
adminRoutes.route('/login').post(loginAdmin);

module.exports = adminRoutes;
