import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { getUsers } from "../utils/getUsers.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(userId);

    const accessToken = await user.generateAccessToken();
    // console.log("accessToken - ", accessToken);
    const refreshToken = await user.generateRefreshToken();
    // console.log("refreshToken -", refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      400,
      "something went wrong while generating Access & Refresh Token"
    );
  }
};

const register = asyncHandler(async (req, res) => {
  //req.body (fullname, password , username)
  const { fullName, email, username, password } = req.body;

  // validation - not empty
  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are Required!!!");
  }

  // check if its already exist - username email fullname

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User with username/email already exist!!");
  }

  // check avatar
  const avatarLocalPath = req.file.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!!!");
  }

  // upload it oncloudinary
  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is Required!!!");
  }

  // create a user in db
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.url,
  });

  // remove passowrd and refreshtoken form it
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestring the user!!");
  }

  return (
    res
      // return res
      .status(200)
      .json(
        new ApiResponse(200, createdUser, "User is successfully created !!")
      )
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "All Fields are Required!!");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(400, "User doesn't exist!!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "password is incorrect !!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loginUser, accessToken, refreshToken },
        "user successfully LoggedIn"
      )
    );
});

const logut = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 }, //this removes the field from document
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "user is successfully Log-Out"));
  } catch (error) {
    throw new ApiError(404, "user is already logged-out !!");
  }
});

const fetchAllUser = asyncHandler(async (req, res) => {
  const allUsers = await getUsers();

  if (!allUsers) {
    throw new ApiError(500, "couldn't fetch the users!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "Users fetched successfully!!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  const user = await User.findOne({
    refreshToken: incomingRefreshToken,
  });

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // const updatedUser  = await User.findById(user._id)

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          // "old-refresh-token" : user?.refreshToken,
          // "new-refresh-token" : updatedUser?.refreshToken
        },
        "Access token refreshed"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Old-password does not matched!!");
  }

  user.password = newPassword;

  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password change successfully !!"));
});

const getCurrUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully !!"));
});

// TODO: TEST BELOW API'S ON POSTMAN !!

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;

  if (!fullName && !email && !username) {
    throw new ApiError(404, "all fields are required !!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
        username,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Updated the User's details successfully !!")
    );
});

const changeAvatar = asyncHandler(async (req, res) => {
  // req.user
  // unlinksync avatar
  // req.file.path
  // upload on cloudinary
  // avatar.url
  // get user
  // updata the database

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "file path not found!!");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error file uploading file on cloudinary !!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(2000, user, "Avatar change successfully !!"));
});

export {
  register,
  login,
  logut,
  fetchAllUser,
  refreshAccessToken,
  changePassword,
  getCurrUser,
  updateAccountDetails,
  changeAvatar
};
