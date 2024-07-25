const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    media: {
        type: Schema.Types.ObjectId,
        ref: 'Media'
        
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
    },
    }, { timestamps: true });

module.exports = mongoose.model('Activity', ActivitySchema)