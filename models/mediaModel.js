const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applyToJSON = require('../middlewares/applyToJson');

const mediaSchema = new Schema({
    url: {
        type: String,
        trim: true,
        unique: true, 
    },
    fileName: {
        type: String,
        trim: true,
    },
    mediaType: { 
        type: String,
        enum: ['image', 'video', 'voice', 'file'],
        lowercase: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    altText: { 
        type: String,
        trim: true,
    },
    
}, { timestamps: true });

applyToJSON(mediaSchema);

module.exports = mongoose.model('Media', mediaSchema);
