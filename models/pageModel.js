const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applyToJSON = require('../middlewares/applyToJson');


const pageSchema = new Schema({
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

    applyToJSON(pageSchema);
module.exports = mongoose.model('Page', pageSchema);
