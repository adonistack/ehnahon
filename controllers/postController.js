const initController = require('./genericController');
const Post = require('../models/postModel');

const postController = initController(Post, "Post", {}, ['slug']);

module.exports = postController;
