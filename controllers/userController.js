const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// generate token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exist = await userModel.findOne({ email: email });
    if (exist) {
      return res.status(400).json('Email already exist');
    }

    // validation
    if (!name || !email || !password) {
      return res.status(400).json('All fields are required');
    }
    if (!validator.isEmail(email)) {
      return res.status(200).json('Email is invalid');
    }

    if (!validator.isStrongPassword(password)) {
      return res
        .status(400)
        .json(
          'Error: Your password must be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and special characters. Please choose a stronger password.'
        );
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // create a user
    const user = await userModel.create({ name, email, password: hash });

    // create a token
    const token = createToken(user._id);
    res
      .status(200)
      .json({ _id: user._id, name, email, password: user.password, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json('Invalid email or password');
    }

    // comparing password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json('Incorrect password');
    }

    // create a token
    const token = createToken(user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email,
      password: user.password,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// finding a user
const findUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json('Invalid Id');

  try {
    const user = await userModel.findById(userId);

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = { registerUser, loginUser, findUser, getAllUsers };
