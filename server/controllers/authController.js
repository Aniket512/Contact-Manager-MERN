const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { fname: "", lname: "", email: "", password: "" };

  if (err.message === "incorrect email") {
    errors.email = "Email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "Password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
module.exports.register = async (req, res, next) => {
  try {
    const { fname, lname, email, password } = req.body;
    const user = await User.create({ fname, lname, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      withCredentials: true,
      httpOnly: true,
      secure: true,
      sameSite: 'None',    
      maxAge: maxAge * 1000,

    });

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',    
      maxAge: maxAge * 1000
    });
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};
