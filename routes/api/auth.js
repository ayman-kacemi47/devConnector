const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route GET api/auth
// @desc    Test route
// @access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/auth
// @desc    authenticate User & get token
// @access Public

router.post(
  '/',
  [
    check('email', 'Please inter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors ', errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // data entrez par l'utilsateurs

    try {
      let user = await User.findOne({ email }); // email : email , but we can use only email because they had the same name

      //check if user  exist
      if (!user) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //chech that passwords match
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      //Return jsonWebToken
      const paylaod = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        // ? and also payload ?
        paylaod,
        config.get('jwtSecret'),
        { expiresIn: 3600 * 100 }, // optionel mais recomendé
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
