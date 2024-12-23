import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import fs from "fs";
import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  console.log("req.body........", req.body);

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  let userExist = false;
  if (existedUser) {
    userExist = true;
    return res.status(201).json({
      userExist,
      message: "User alreday exist",
    });
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json({
    data: createdUser,
    userExist,
    message: "User registered Successfully",
  });
};

const loginUser = async (req, res) => {
  console.log("req.body in login: ", req.body);
  const { username, password } = req.body;
  try {
    const foundUserEmail = await User.findOne({ email: username });
    const foundUserUsername = await User.findOne({ username });
    let passwordNotMatch = false;
    if (foundUserEmail) {
      passwordNotMatch = await User.findOne({ email: username, password });
    } else if (foundUserUsername) {
      passwordNotMatch = await User.findOne({ username, password });
    }

    if ((foundUserEmail || foundUserUsername) && passwordNotMatch) {
      if (foundUserEmail) {
        res.status(200).json({
          data: foundUserEmail,
          message: "User logged in Successfully",
          status: true,
        });
      } else {
        res.status(200).json({
          data: foundUserEmail,
          message: "User logged in Successfully",
          status: true,
        });
      }
    } else if ((foundUserEmail || foundUserUsername) && !passwordNotMatch) {
      res.status(500).json({
        data: foundUserEmail,
        message: "wrong password",
        status: false,
      });
    } else {
      res.status(500).json({
        data: foundUserEmail,
        message: "username doesn't exist",
        status: "username doesn't exist",
      });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Something went wrong",
      status: "something went wrong",
    });
  }
};

const sendemailverificationcode = async (req, res) => {
  const { code, email } = req.body;

  console.log("req.body: ", req.body);

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "ghfs wdlk pkwd pjmg",
    },
  });

  console.log("transporter: ", transporter);

  // Setup email data
  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Email Verification Code",
    text: `Welcome to quiz recommendation website. Please, verify your email by entering the code. Your verification code is: ${code}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

export { registerUser, loginUser, sendemailverificationcode };