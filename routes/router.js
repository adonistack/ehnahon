const express = require('express');
const createCrudRoutes = require('./crudRoutes');
const router = express.Router();

const authRoutes = require('./authRoute');
const activityController = require('../controllers/activityController');
const categoryController = require('../controllers/categoryController');
const eventController = require('../controllers/eventController');
const mediaController = require('../controllers/mediaController');
const pageController = require('../controllers/pageController');
const postController = require('../controllers/postController');

router.use('/', authRoutes);
router.use('/activities', createCrudRoutes(activityController));
router.use('/categories', createCrudRoutes(categoryController));
router.use('/events', createCrudRoutes(eventController));
router.use('/media', createCrudRoutes(mediaController));
router.use('/pages', createCrudRoutes(pageController));
router.use('/posts', createCrudRoutes(postController));


module.exports = router;
