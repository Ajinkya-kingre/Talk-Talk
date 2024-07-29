import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_NAME } from "../constants.js";
import fs from "fs";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("LocalFilePath is not correct");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};


export {uploadCloudinary}
