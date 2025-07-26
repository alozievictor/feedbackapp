const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
// Try with hardcoded values for testing
cloudinary.config({
  cloud_name: 'feedbackapp',
  api_key: '513785597197957',
  api_secret: 'TOBcNoPeufAZ433lWoq4wwAEci8'
});

// Configure CloudinaryStorage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rivong-feedback',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'svg', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'ai', 'psd'],
    resource_type: 'auto',
  },
});

module.exports = {
  cloudinary,
  cloudinaryStorage,
};
