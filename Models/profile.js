const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    username: { type: String, unique: true, sparse: true },
    profilePicture: { type: String, default: '' },
    phone: { type: String },
    bio: { type: String },
    location: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
