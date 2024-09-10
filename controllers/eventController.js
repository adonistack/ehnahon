const initController = require('./genericController');
const Event = require('../models/eventModel');

const eventController = initController(Event, "event", {}, ['slug'], ['media', 'owner' ]);

module.exports = eventController;
