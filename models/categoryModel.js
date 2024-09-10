const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applyToJSON = require('../middlewares/applyToJson');


const categorySchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String },
    count: { type: Number, default: 0 },
    media: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
  
});

applyToJSON(categorySchema);
module.exports = mongoose.model('Category', categorySchema);
