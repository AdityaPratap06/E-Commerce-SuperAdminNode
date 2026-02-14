const express = require('express');
const { login } = require('../Controllers/userController');
const userRoutes = express.Router();

userRoutes.route('/login').post(login);

module.exports = userRoutes;
