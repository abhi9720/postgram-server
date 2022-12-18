const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuth = require("../Middleware/auth");

const { check, validationResult } = require("express-validator");
// Register
router.post("/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required ").exists(),
    check("username", "Username is required ").exists(),
  ]
  , async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body.username, req.body.email, req.body.password)
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User already exists" }] });
    }

    try {
      // generate hashed password      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // create new user
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // saveuser 
      await user.save();


      const payload = {
        user: {
          id: user._id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "160h" },
        (err, token) => {
          if (err) throw err;
          return res.status(200).json({ token, user });
        }
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });

// login user
router.post("/login", [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials" }] });
    }


    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };


    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "160h" },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({ token, user });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error ");
  }
});



// @route    GET auth
// @desc     Get user by token
// @access   Private
router.get('/', isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new Error('User Not Found :)')
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
