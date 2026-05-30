const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'shoemart/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, and AVIF images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
