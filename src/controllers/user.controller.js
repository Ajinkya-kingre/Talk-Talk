import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

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
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while regestring the user!!");
  }
  
  return res
  // return res
  .status(200)
  .json(
    new ApiResponse(
        200, createdUser, "User is successfully created !!"
    )
  )

});

export { register };
