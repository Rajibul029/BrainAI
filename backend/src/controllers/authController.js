
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (
  req,
  res
) => {
  try {
    const { name, email, password } =
      req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "name, email, and password are required",
      });
    }

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user =
      await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};