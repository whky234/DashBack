const express=require('express')
const {registerUser,login,getUsers,DeleteUser,EditUser,
    changeUserRole,Adduser,changeStatus,setPassword,getCurrentUser,setnewpassword}=require('../Conrollers/Auth');
const {Protect,isAdmin}=require('../Middlewares/authmiddel')

const router=express.Router()

router.post('/register',registerUser);
router.post('/login',login);
router.post("/set-password", setPassword); // New route for setting password
router.post("/new-password",Protect, setnewpassword); // New route for setting password



router.get('/getUsers',Protect,isAdmin,getUsers);
router.delete('/delete/:id',Protect,isAdmin,DeleteUser);
router.put('/Edit/:id',Protect,isAdmin,EditUser);
router.put('/EditRole/:id',Protect,isAdmin,changeUserRole);
router.post('/AddUser',Protect,isAdmin,Adduser);
router.put('/Status/:id',Protect,isAdmin,changeStatus);
router.get('/current',Protect,getCurrentUser);










module.exports=router

