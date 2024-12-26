import User_Model from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const registerMiddleware = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }
    const user = await User_Model.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exist", success: false });
    }
    next();
  } catch (error) {
    console.log(`Error in registerMiddleware: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }
    const result = await User_Model.findOne({ email });
    if (!result) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const { _id, name, DOB, imageDetails, bio } = result;
    req.userData = {
      _id,
      name,
      DOB,
      imageDetails,
      bio,
    };
    next();
  } catch (error) {
    console.log(`Error in loginMiddleware: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};
export const logoutMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error(`Token missing`);
    const result = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    console.log(`Error in Logout Middleware ${error.message}`);
    return res
      .status(400)
      .json({ message: `Invalid cookie/token`, success: false });
  }
};
export const deleteMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token Missing");
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const { _id, name, email } = data;
    req.userData = {
      _id,
      name,
      email,
    };
    next();
  } catch (error) {
    console.log(`Error in Delete Middleware ${error.message}`);
    return res
      .status(400)
      .json({ message: `Invalid cookie/token`, success: false });
  }
};
