const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const User = require('../models/users');

// @route     POST users
// @desc      Register user
// @access    Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password of at least 6 characters').isLength({
    min: 6
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const { name, email, password } = req.body;
  try {
    // check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errors: [{
          msg: 'User already existed'
        }]
      });
    }

    // get users gravatar
    const avatar = gravatar.url(email, {
      s: '200', // size
      r: 'pg', // pg rating
      d: 'mm' // default
    });

    user = new User({ name, email, avatar, password });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // return jsonwebtoken
    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_KEY, {
      expiresIn: 360000
    },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          msg: "User registered",
          token
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json({
      count: result.length,
      result,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: 'Server Error',
      err,
    })
  }
});

module.exports = router;