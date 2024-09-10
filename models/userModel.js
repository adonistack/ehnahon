const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profilePicture: { type: Schema.Types.ObjectId, ref: 'Media' },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });

const isDevelopment = process.env.NODE_ENV === 'development';

userSchema.pre('save', async function(next) {
  try {
    if (this.isAdmin && !isDevelopment) {
      return next(new Error('Creating admin users is not allowed in production mode'));
    }

    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    console.error('Error in userSchema pre-save:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Error comparing passwords');
  }
};

module.exports = mongoose.model('User', userSchema);
