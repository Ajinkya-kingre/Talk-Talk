import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";


const sendMsg = asyncHandler(async (req, res) => {
  const { chatId, msg } = req.body;

  if (!chatId && !msg) {
    throw new ApiError(400, "All Fields are required!!");
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(400, "Chat doesn't don't exists!!");
  }

  const createMsg = await Message.create({ msg, sender: req.user._id, chatId });

  if(!createMsg){
    throw new ApiError(404, "Error while creating message !!")
  }

  let populateMsg = await createMsg
  .populate("sender", "username fullName avatar")
  .populate({
    path : "chatId",
    select : "name isGroup members",
    model : "Chat",
    populate :{
        path : "members",
        select : "username fullName avatar",
        model : "User",
    } 
  })

  if(!populateMsg){
    throw new ApiError(400, "Couldn't populate the message!!")
  }

  const updateChat = await Chat.findByIdAndUpdate(chatId,
    {
        $set : {latestMessage : populateMsg}
    },
    {
        new : true
    }
  )

  if(!updateChat){
    throw new ApiError(400, "Couldn't push msg into latestmessage!!")
  }


  return res
  .status(200)
  .json(new ApiResponse(200, updateChat, "Message is sent!!"))

});

const getMsg = asyncHandler(async (req, res) => {
    const {chatId} = req.params;

    if(!chatId){
        throw new ApiError(404, "Didn't find ChatId!!");
    }

    const msg = await Message.find({chatId})
    .populate({
        path : "sender",
        model : "User",
        select : "username fullName avatar -password -refreshToken",
    })
    .populate({
        path : "chatId",
        model : "Chat"
    });

    if(!msg){
        throw new ApiError(404, "Couldn't get the Message!!")
    };

    return res
    .status(200)
    .json(new ApiResponse(200, msg, "retrive message successfully!!"))

}) 

export {sendMsg, getMsg};
