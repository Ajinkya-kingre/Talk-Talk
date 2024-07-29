import mongoose, { Schema } from "mongoose";

const chatIdSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
      //TODO:  Default : "put a default pic for avatar",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId(),
        ref: "User",
      },
    ],
    isAdmin: {
      type: Schema.Types.ObjectId(),
      ref: "User",
      required: true,
    },
    latestMessage: {
      type: Schema.Types.ObjectId(),
      ref: "Message",
    },
    isGroup : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatIdSchema);
