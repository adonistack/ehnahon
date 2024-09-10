const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/sign-up', authController.createAccount);
router.post('/sign-in', authController.createLogin);
router.get('/users', authController.getAllUsers);
router.get('/user/:id', authController.getUserById);
router.get('/current-user', authController.getCurrentUser);
router.put('/update', authController.updateCurrentUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.delete('/delete', authController.deleteAccount);
router.post('/logout', authController.logout);

module.exports = router;
