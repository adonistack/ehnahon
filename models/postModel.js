const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
          type: String,
          required: true
     },
   description: {
        type: String,
        required: true
    },
   content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    media: [{
        type: Schema.Types.ObjectId,
        ref: 'Media'
      }], 
 
    }, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
