const express = require('express');
const activityController = require('../controllers/activity.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Log Activity
router.post('/activity/log', authMiddleware, activityController.logActivity);

// List User's Activity Logs
router.get('/activity/logs', authMiddleware, activityController.listUserActivityLogs);

module.exports = router;

