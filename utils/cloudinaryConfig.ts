import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// Cloudinary upload function
const uploadFileToCloudinary = async (file: any, id: string) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "catering-management-system/users", public_id: id },
      (error: any, result: any) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer); // Buffer
  });
};
// Cloudinary delete function
const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted image: ${publicId}`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
export { uploadFileToCloudinary, deleteFromCloudinary };
