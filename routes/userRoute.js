const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

// router
const router = express.Router();

// routers
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
