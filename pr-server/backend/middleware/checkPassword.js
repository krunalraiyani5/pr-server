const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const checkPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid Email or Password" });
  }
};

module.exports = checkPassword;
