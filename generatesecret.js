const crypto = require('crypto');

// Generate a random string of a specific length
const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

// Set the desired length for your JWT_SECRET
const secretLength = 32; // You can adjust the length as needed

// Generate the random string
const jwtSecret = generateRandomString(secretLength);

// Display the generated JWT_SECRET
console.log(`JWT_SECRET=${jwtSecret}`);

