import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path : "./.env"
})


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
// console.log(process.env.CLOUDINARY_CLOUD_NAME);


const uploadCloudinary = async (localFilePath) => {
    console.log(localFilePath);
  try {
    if (!localFilePath) {
      console.log("localfilepath required !!!")
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    
    //TODO: unlink the file from local server
    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    //TODO: unlink the file from local server
    return null;
  }
};


export {uploadCloudinary}
