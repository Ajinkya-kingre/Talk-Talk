import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { getUsers } from "../utils/getUsers.js";

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
    throw new ApiError(400, "password is incorrect11");
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
        { loginUser, accessToken, refreshToken },
        "user successfully LoggedIn"
      )
    );
});

const logut = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
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
});

const fetchAllUser = asyncHandler(async (req, res) => {
  const allUsers = await getUsers();

  if(!allUsers){
    throw new ApiError(500, "couldn't fetch the users!!")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, allUsers, "Users fetched successfully!!"))

});



export { register, login, logut, fetchAllUser };
