const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Updated import

// import userRoute
const userRoutes = require('./routes/userRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
// Add other middleware as needed

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
  //useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB, you can now start to test your endpoint');
});

// Use userRoutes
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

