const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUD_NAME && 
  process.env.CLOUD_API_KEY && 
  process.env.CLOUD_API_SECRET &&
  process.env.CLOUD_NAME !== 'your_cloudinary_cloud_name'
);

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

  const targetFolder = process.env.CLOUDINARY_FOLDER || 
    (process.env.NODE_ENV === 'production' ? 'Roomwati_PROD' : 'Roomwati_DEV');

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: targetFolder,
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });
} else {
  const uploadDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
}

module.exports = {
  cloudinary,
  storage,
  isCloudinaryConfigured
};