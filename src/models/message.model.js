import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    msg: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      require: true,
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
