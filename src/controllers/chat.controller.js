import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const accessChat = asyncHandler(async (req, res) => {
  // get reciever user.id
  // !user.id
  // check if reciever-user.id and sender.user.id had any chat before
  // get their details remove password
  // get latestmessage to
  // first time talking create new chat for them using thier ID

  const { recieverId } = req.body;

  if (!recieverId) {
    throw new ApiError(400, "Reciever param could not find !!");
  }

  let isChat = await Chat.find({
    isGroup: false,
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: recieverId } } },
    ],
  })
    .populate("members", "-password -refreshToken ")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "username fullName avatar",
      },
    });

  if (isChat.length > 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, isChat[0], "chat between given users found !!")
      );
  } else {
    const chatData = {
      name: "sender",
      members: [req.user._id, recieverId],
      isGroup: false,
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate("members", "-password  -refreshToken ")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username fullName avatar email",
        },
      });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          fullChat,
          "chat is successfully created between given users!!"
        )
      );
  }
});

export { accessChat };
