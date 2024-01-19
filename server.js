const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

// Import User model
const User = require('./models/user.model'); // Add this line
const Post = require('./models/post.model'); // Add this line
const Category = require('./models/category');
const Comment = require('./models/comment');
const Like  = require('./models/like');
const Bookmark = require('./models/bookmark.model')
const Tag  = require('./models/tag.model')
// import post route
const postRoutes = require('./routes/postRoutes'); 
// Import Category routes
const categoryRoutes = require('./routes/categoryRoutes');

// Import userRoutes
const userRoutes = require('./routes/userRoutes');
// Import CommentRoutes
const commentRoutes = require('./routes/commentRoutes');
// import likeRoutes
const likeRoutes = require('./routes/like.routes');
// import bookmarkRoutes
const bookmarkRoutes = require('./routes/bookmark.routes');
// import tagRoutes
const tagRoutes = require('./routes/tag.routes'); 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GoogleStrategy({
  clientID: '160112374519-3qqt8p8cpbde98bn4p9puocin3gfhomc.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3001/google/callback', // Update the callback URL
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
// use PostRoutes
app.use('/api/posts', postRoutes);
// Use categoryRoutes
app.use('/api/categories', categoryRoutes);


// use commentRoutes
app.use('/api/comments', commentRoutes);
// Use the like routes
app.use('/api/likes', likeRoutes);

// use bookmark routes
app.use('/api/bookmarks', bookmarkRoutes);
// Use your tag routes
app.use('/api', tagRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

