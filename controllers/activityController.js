const initController = require('./genericController');
const Activity = require('../models/activityModel');
const activityController = initController(Activity, "Activity", {}, ['slug']);

module.exports = activityController;
