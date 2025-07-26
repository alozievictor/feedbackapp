const cloudinary = require('cloudinary').v2;

// Configure with hardcoded values for testing
cloudinary.config({
  cloud_name: 'feedbackapp',
  api_key: '513785597197957',
  api_secret: 'TOBcNoPeufAZ433lWoq4wwAEci8'
});

// Test if account is valid by making a simple API call
async function testCloudinaryAccount() {
  try {
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    console.log('Success! Cloudinary connection is working:', result);
    return true;
  } catch (error) {
    console.error('Error connecting to Cloudinary:');
    console.error('- Message:', error.message);
    console.error('- HTTP Code:', error.http_code);
    
    if (error.message.includes('Invalid cloud_name')) {
      console.error('\nThe cloud_name "feedbackapp" is invalid.');
      console.error('Please check your Cloudinary account details and update accordingly.');
    }
    
    return false;
  }
}

testCloudinaryAccount().then(isValid => {
  if (!isValid) {
    console.log('\nPlease verify your Cloudinary account at https://cloudinary.com/console');
  }
});
