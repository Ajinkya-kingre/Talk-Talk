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

// TODO: Test this controller on POSTMAN
const fetchAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("members")
    .populate("latestMessage")
    .populate("isAdmin")
    .sort({ updateAt: -1 });

  if (!chats) {
    throw new ApiError(400, "can't fetch the chats!!");
  }

  const finalChats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "username fullName avatar email",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        finalChats,
        "successfully fetched the users previous chats!!"
      )
    );
});

// TODO: Test this controller on POSTMAN
const createGroup = asyncHandler(async (req, res) => {
  const { groupName, members } = req.body;

  if (!groupName || !members) {
    throw new ApiError(
      400,
      "groupname and members are required you dumbADSS !!"
    );
  }

  const parsedMembers = JSON.parse(members);

  if (parsedMembers.length < 2) {
    throw new ApiError(400, "Group should contain more thatn 2 members");
  }
  parsedMembers.push(req.user._id);

  const group = await Chat.create({
    name: groupName,
    members: [parsedMembers],
    isAdmin: req.user._id,
    isGroup: true,
  });

  const createdGroup = await Chat.find({ _id: group._id })
    .populate("members", "-password", "-refreshToken")
    .populate("isAdmin", "-password", "-refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, createdGroup, "Created Group Successfully!!"));
});

const renameChat = asyncHandler(async (req, res) => {
  // get the chat._id and newName
  // check if chat._id and newName is not empty
  // check if chat exist
  // if not give the error
  // if yes $set the name to newName

  const { chatId, newName } = req.bod;

  if (!chatId && !newName) {
    throw new ApiError(404, "chatId and newName is required!!");
  }

  const isChatExist = await Chat.findById(chatId);
  if (!isChatExist) {
    throw new ApiError(404, "Chat does not exist!!");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { name: newName },
    },
    {
      new: true,
    }
  );

  if (!updatedChat) {
    throw new ApiError(400, "Error while updating the chat!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedChat, "Update the chat name successfully !!")
    );
});
export { accessChat, fetchAllChats, createGroup, renameChat };
