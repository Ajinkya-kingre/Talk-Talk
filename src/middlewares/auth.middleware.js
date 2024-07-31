import { ApiError } from "../utils/ApiError.js";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = async (req, _, next) => {
  try {
    // access cookies
    // check the access token
    // decode the access token
    // find user by id
    // req.user = user

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log(token);

    if (!token) {
      throw new ApiError(404, "Unauhtorized request !!");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    // console.log("token",token, "secretkey", process.env.ACCESS_TOKEN_SECRET_KEY)

    const user = await User.findById(decodeToken._id).select(
      "-password --refreshToken"
    );

    if (!user) {
      throw new ApiError(404, "Invalid access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(404, error.message);
  }
};
