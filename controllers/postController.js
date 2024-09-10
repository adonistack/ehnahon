const initController = require('./genericController');
const Post = require('../models/postModel');

const postController = initController(Post, "Post", {}, ['slug'], ['media', 'owner' ]);

module.exports = postController;
