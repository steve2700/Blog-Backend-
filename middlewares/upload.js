const multer = require('multer');

const storage = multer.memoryStorage(); // Use memory storage for simplicity, adjust as needed
const upload = multer({ storage: storage });

module.exports = upload;

