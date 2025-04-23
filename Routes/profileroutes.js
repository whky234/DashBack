const {
    getUserWithProfile,
    updateProfile,
  } = require('../Conrollers/profilecon');

  const {Protect,isAdmin}=require('../Middlewares/authmiddel')

  const express=require('express')

const router=express.Router()


router.get('/', Protect, getUserWithProfile);

router.put('/add', Protect, updateProfile);

module.exports = router;