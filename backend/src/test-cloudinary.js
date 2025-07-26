const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

// Log the configuration
console.log('Cloudinary Configuration:');
console.log('- Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('- API Key:', process.env.CLOUDINARY_API_KEY ? '**Set**' : '**Not Set**');
console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? '**Set**' : '**Not Set**');

// Configure Cloudinary with direct values (for testing)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test connection
async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Cloudinary connection successful:', result);
  } catch (error) {
    console.error('Cloudinary connection failed:', error);
  }
}

testCloudinary();
