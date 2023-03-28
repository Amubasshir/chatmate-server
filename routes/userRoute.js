const express = require('express');
const {
  registerUser,
  loginUser,
  findUser,
  getAllUsers,
} = require('../controllers/userController');

// router
const router = express.Router();

// routers
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/find/:userId', findUser);
router.get('/', getAllUsers);

module.exports = router;
