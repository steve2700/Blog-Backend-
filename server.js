const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Updated import
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// import userRoute
const userRoutes = require('./routes/userRoutes');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

passport.use(new GoogleStrategy({
  clientID: '160112374519-3qqt8p8cpbde98bn4p9puocin3gfhomc.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3001',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user exists based on Google profile ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If the user doesn't exist, create a new user with Google profile information
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        // Add other relevant profile information
        googleId: profile.id,
      });

      await user.save();
    }

    // Pass the user object to the passport callback
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

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

