const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../smtp/email/emailSender');

const generateToken = (userId, email) => {
  return jwt.sign({ email, id: userId }, process.env.JWT_SECRET, { expiresIn: '240h' });
};

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authentication token missing or malformed');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw new Error('Invalid or expired token');
    return decoded;
  });
};

exports.createAccount = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      return res.status(400).json({ message: existingUser.email === email ? 'Email already exists' : 'Username already exists' });
    }

    const newUser = await User.create({ ...req.body, password });

    const token = generateToken(newUser._id, newUser.email);

    return res.status(201).json({ message: 'User created successfully', result: newUser, token });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.createLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.email);

    return res.status(200).json({
      message: 'Login successful',
      result: user,
      token
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    const user = await User.findById(decodedToken.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.updateCurrentUser = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    const user = await User.findById(decodedToken.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    ['firstName', 'lastName', 'userName', 'email'].forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });
    if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);

    await user.save();
    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);
    user.resetToken = hashedResetToken;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `http://localhost:3000/reset?resetToken=${resetToken}`;
    const message = `
      <h1>Password Reset</h1>
      <p>Click the link below to reset your password</p>
      <a href="${resetUrl}">Reset Password</a>
    `;
    await sendEmail({ to: user.email, subject: 'Password Reset', text: message });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) return res.status(400).json({ message: 'Passwords do not match' });

  try {
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    const user = await User.findOne({
      resetToken: hashedResetToken,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const decodedToken = verifyToken(req);
    const user = await User.findByIdAndDelete(decodedToken.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
};
