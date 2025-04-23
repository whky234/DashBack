const User = require('../Models/user');
const Profile = require('../Models/profile');

const getUserWithProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profile = await Profile.findOne({ userId });

    res.status(200).json({ user, profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      profile = new Profile({ userId, ...updates });
    } else {
      Object.assign(profile, updates);
    }

    await profile.save();
    res.status(200).json({message:'profile update succssfully',profile});
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = {
  getUserWithProfile,
  updateProfile,
};
