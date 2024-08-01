import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");

    if (!users) {
      throw new ApiError(400, "something went wrong while fetchiing Users");
    }

    return users;
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

export { getUsers };
