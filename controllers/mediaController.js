const initController = require('./genericController');
const Media = require('../models/mediaModel');

const mediaController = initController(Media, 'Media', {}, ['url']);

module.exports = mediaController;
