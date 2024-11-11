import User from "../models/userModal.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import jwt from "jsonwebtoken";

class AuthController {
  //create and send jwt token
  createSendToken = async (user, statusCode, req, res) => {
    const token = await this.signToken(user._id);

    //Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      data: user,
      token,
    });
  };

  //sign jwt token
  signToken = (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  };

  // verify the token
  verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };

  // login
  login = catchAsync(async (req, res, next) => {
    const { userName, password } = req.body;

    //Check if email and password is sent
    if (!userName || !password) {
      return next(new AppError("User name and Password is required!", 400));
    }

    //check if user exist and password is correct
    const user = await User.findOne({ userName }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect user name or password", 401));
    }

    //If everything ok send response
    this.createSendToken(user, 200, req, res);
  });

  //Protect the api from other unknown user
  protect = catchAsync(async (req, res, next) => {
    //check if token present or not
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === null) {
      return next(new AppError("User not logged in!", 401));
    }

    //verify token
    const decoded = await this.verifyToken(token);

    //check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    //Grant acces to protected route
    req.user = freshUser;
    return next();
  });

  getMe = catchAsync(async (req, res, next) => {
    //get user id
    const userId = req.user._id;

    //get user data
    const user = await User.findById(userId);

    res.status(200).json({
      status: "success",
      data: user,
    });
  });
}

// Exporting an instance of the authController class
const authController = new AuthController();
export default authController;
