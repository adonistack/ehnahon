const initController = require('./genericController');
const Page = require('../models/pageModel');

const pageController = initController(Page,"Page", {}, ['slug'], ['media', 'owner' ]);

module.exports = pageController;
