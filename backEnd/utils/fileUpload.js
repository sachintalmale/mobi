const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
const fileUpload = async (file) => {
  if (file.mimetype.slice(0, 5) === 'video') {
    return await cloudinary.uploader.upload(file.path, {
      resource_type: 'video',
      end_offset: '30',
      video_codec: 'auto',
    });
  }
  return await cloudinary.uploader.upload(file.path);
};

module.exports = fileUpload;
