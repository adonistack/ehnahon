const cron = require('node-cron');

const Post = require('./models/postModel');



function startCronJobs() {

    cron.schedule('0 0 * * *', async () => {
        try {
            const counts = await Post.countPostsByCategory(); // Call the static method
            console.log('Post counts by category:', counts);
        } catch (error) {
            console.error('Error running cron job for post counts:', error);
        }
    });
  
}

module.exports = startCronJobs;
