// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  // Import Cloudinary library and Cloudinary storage for Multer
  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  
  // Configure Cloudinary with API credentials from environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Your Cloudinary account's cloud name
    api_key: process.env.API_KEY, // Your Cloudinary API key
    api_secret: process.env.API_SECRET, // Your Cloudinary API secret
  });
  
  // Set up CloudinaryStorage to handle file uploads
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Reference to the configured Cloudinary instance
    params: {
      folder: "wandarlust_Dev", // The folder where uploaded files will be stored in Cloudinary
      format: async (req, file) => {
        // Map MIME types to file formats supported by Cloudinary
        const mimeToFormat = {
          "image/png": "png",
          "image/jpeg": "jpg",
        };
        // Return the appropriate format based on the file's MIME type
        // Defaults to "jpg" if the MIME type is unsupported
        return mimeToFormat[file.mimetype] || "jpg";
      },
    },
  });
  
  // Export the Cloudinary instance and storage configuration for use in other modules
  module.exports = {
    cloudinary, // The Cloudinary instance
    storage, // The Multer storage configuration for Cloudinary
  };
  