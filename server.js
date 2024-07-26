const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Import models and routes
const User = require('./models/user.model');
const Post = require('./models/post.model');
const Category = require('./models/category');
const Comment = require('./models/comment');
const Like = require('./models/like');
const Bookmark = require('./models/bookmark.model');
const Tag = require('./models/tag.model');
const Activity = require('./models/activity.model');
const Rating = require('./models/rating.model');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/auth');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/like.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');
const tagRoutes = require('./routes/tag.routes');
const activityRoutes = require('./routes/activity.routes');
const ratingRoutes = require('./routes/rating.routes');
const searchRoutes = require('./routes/search.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB, you can now start to test your endpoint');
});

// Authentication routes
app.use('/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api', tagRoutes);
app.use('/api', activityRoutes);
app.use('/api', ratingRoutes);
app.use('/api', searchRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Export app for testing
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} else {
  module.exports = app;
}

