const ActivityLog = require('../models/activity.model');
const authMiddleware = require('../middlewares/auth.middleware');

const activityController = {
  // Log Activity
  logActivity: [authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { action, details } = req.body;

      // Create a new activity log entry
      const newActivityLog = new ActivityLog({ user: userId, action, details });
      await newActivityLog.save();

      res.status(201).json({ activityLog: newActivityLog });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List User's Activity Logs
  listUserActivityLogs: [authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;

      // Retrieve activity logs for the specific user
      const userActivityLogs = await ActivityLog.find({ user: userId });

      res.status(200).json({ activityLogs: userActivityLogs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = activityController;

