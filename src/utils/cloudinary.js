import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});



const uploadCloudinary = async (localFilePath) => {
    console.log(localFilePath);
  try {
    if (!localFilePath) {
      
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};


export {uploadCloudinary}
