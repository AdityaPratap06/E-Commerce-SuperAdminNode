const express = require('express');
const { createAdmin } = require('../Controllers/adminController');
const adminRoutes = express.Router();

adminRoutes.route('/create').post(createAdmin);

module.exports = adminRoutes;
