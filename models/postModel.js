const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const applyToJSON = require('../middlewares/applyToJson');

// Define Post Schema
const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    media: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Add category reference
}, { timestamps: true });

// Static method to count posts by category
postSchema.statics.countPostsByCategory = async function () {
    const count = await this.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'categories', // MongoDB collection name
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $project: {
                _id: 0,
                categoryName: '$category.name',
                postCount: '$count'
            }
        }
    ]);
    return count;
};

// Middleware to update category count on post save
postSchema.post('save', async function (doc) {
    const category = await mongoose.model('Category').findById(doc.category);
    if (category) {
        category.count = await mongoose.model('Post').countDocuments({ category: doc.category });
        await category.save();
    }
});

// Middleware to update category count on post remove
postSchema.post('remove', async function (doc) {
    const category = await mongoose.model('Category').findById(doc.category);
    if (category) {
        category.count = await mongoose.model('Post').countDocuments({ category: doc.category });
        await category.save();
    }
});

// Apply JSON middleware if needed
applyToJSON(postSchema);

module.exports = mongoose.model('Post', postSchema);
