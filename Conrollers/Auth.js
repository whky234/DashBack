
const User=require('../Models/user')
const generateToken=require('../Utils/generatetoken')
const crypto = require("crypto");
const sendEmail = require("../Utils/email"); // Assume you have a function to send emails
const bcrypt=require('bcryptjs')



const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body);

  try {
    // Check if the email already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if the role is 'admin' and if an admin already exists
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });

      if (adminExists) {
        return res.status(400).json({ message: 'Only one admin can exist in the system' });
      }
    }

    const status = role === "admin" ? "active" : "pending";

    // Create the user
    const user = await User.create({ name, email, password, role ,status});

    res.status(200).json({
      message:'User Register successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status:user.status,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
    console.log(err);
  }
};



const login=async(req,res)=>{
    const {email,password}=req.body
    console.log(req.body)

    try{
        const user=await User.findOne({email});

        if(!user || !( await user.matchPassword(password))){
            return  res.status(400).json({message:'Invalid email or password'});

        }

        if(user.status!=='active'){
            return  res.status(403).json({message:'Your Acoount is pending to approval'});

        }

        res.status(200).json({
          message:'login successfully',
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            role:user.role,
            status:user.status,
            token:generateToken(user._id)
    
        });
    }catch(error){
      console.error('Login Error:', error);
      res.status(500).json({ message: 'Something went wrong during login.' });

    }
}

const setnewpassword=async(req,res)=>{
  const userID=req.user.id;
  const {currentPassword,newPassword}=req.body;

  try {
    const user=await User.findById(userID).select("+password");

    if(!user){
      return  res.status(400).json({message:'user not found'});
    }

    const isMatch=bcrypt.compare(currentPassword, user.password);

    if(!isMatch){
      return  res.status(401).json({message:'password not match'});

    }

    user.password=newPassword;

   await user.save()
   return  res.status(200).json({message:'password reset successfully'});

  } catch (err) {
    res.status(500).json({message:'server side error',err})
    console.log(err)

  }
}


const getUsers=async(req,res)=>{

const currentuser=req.user.id
    try{
    
    const users=await User.find({_id:{$ne:currentuser}},{password:0});
    if(!users){
      return  res.status(401).json({message:'users not found'})
    }

    res.status(200).json(users)
    console.log(users)
}catch(err){
    res.status(500).json({message:'server error',err})
}
}

const DeleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("Fetched user:", user); // Debug

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin users cannot be deleted' });
    }

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



const EditUser=async(req,res)=>{
    const {id}=req.params;
    const {name,email,role,status}=req.body;

    try{
        const user=await User.findById(id);

        if(!user){
            return  res.status(401).json({message:'users not found'})

        }

        if(user.role==='admin' && !role==='admin'){
            const admincount=await User.countDocuments({role:'admin'})
            if(admincount===1){
                return  res.status(403).json({message:'cannot edit only Admin'})
            }
        }

        // Prevent one admin from changing another admin's status
      if (user.role === 'admin' && req.user?.role === 'admin') {
        return res.status(403).json({ message: 'Admins cannot change the data of other admins' });
    }


        user.name=name||user.name;
        user.email=email||user.email;
        user.role=role||user.role;
        user.status=status||user.status;


        await user.save();

        res.status(200).json({message:'user update successfully',user})

    }catch(err){
        res.status(500).json({message:'server side error',err})
        console.log(err)

    }
}

const changeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Prevent one admin from changing another admin's status
      if (user.role === 'admin' && req.user?.role === 'admin') {
          return res.status(403).json({ message: 'Admins cannot change the status of other admins' });
      }

      // Optional: Prevent changing status of the last remaining admin
      if (user.role === 'admin') {
          const adminCount = await User.countDocuments({ role: 'admin' });
          if (adminCount === 1) {
              return res.status(403).json({ message: 'Cannot change status of the only admin' });
          }
      }

      user.status = status;
      await user.save();

      res.status(200).json({ message: 'User status updated successfully', user });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server side error', error: err.message });
  }
};




const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  try {
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Prevent changing FROM admin TO any other role
      if (user.role === 'admin' && role !== 'admin') {
          return res.status(403).json({ 
              message: 'Admins cannot be changed to other roles once assigned' 
          });
      }

      // Allow changing to admin or other role changes (unless current role is admin)
      user.role = role;
      await user.save();
      
      res.status(200).json({ 
          message: 'User role updated successfully', 
          user 
      });

  } catch (err) {
      console.error(err);
      res.status(500).json({ 
          message: 'Server error', 
          error: err.message 
      });
  }
};


const Adduser = async (req, res) => {
    const { name, email, role } = req.body;
  
    try {
      const userExist = await User.findOne({ email });
  
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Check if the role is 'admin' and if an admin already exists
      if (role === "admin") {
        const adminExists = await User.findOne({ role: "admin" });
  
        if (adminExists) {
          return res.status(400).json({ message: "Only one admin can exist in the system" });
        }
      }
  
      // Generate a token for setting the password
      const token = crypto.randomBytes(20).toString("hex");
  
      // Create the user without a password
      const user = await User.create({
        name,
        email,
        role,
        status: "active",
        passwordResetToken: token,
        passwordResetExpires: Date.now() + 3600000, // Token expires in 1 hour
      });
  
      // Send an email to the user with the token
      const resetBaseUrl =
      process.env.NODE_ENV === "production"
        ? "https://imaginative-empanada-3e372f.netlify.app"
        : "http://localhost:5173";

      // const resetBaseUrl="https://productsdash.netlify.app"
    
    const resetUrl = `${resetBaseUrl}/set-password?token=${token}`;
          const message = `You have been added to the system. Please set your password by clicking the link below:\n\n${resetUrl}`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: "Set Your Password",
          message,
        });
        console.log("Email sent successfully to:", user.email);
      } catch (err) {
        console.error("Failed to send email:", err);
        throw err; // Rethrow the error to handle it in the calling function
      }
  
      res.status(200).json({
        message: "User add successfully",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
      
    } catch (err) {
      console.error("Error in Adduser:", err);
      res.status(500).json({ message: "Server side error", err });
    }
  };

  const setPassword = async (req, res) => {
    const { token, password } = req.body;
  
    console.log(req.body);
    try {
      // Find the user by the token and check if it's valid
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() }, // Check if the token is not expired
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
  
      // Set the new password
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password set successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server Error", err });
    }
  };


const getCurrentUser=async(req,res)=>{

  try{
    const user=await User.findById(req.user.id).select('-password')
    if(!user){
      return res.status(400).json({ message: "User not found" });

    }
    res.status(200).json(user)
  }catch(err){
    res.status(500).json({ message: "Server Error", err });

  }
  
}
module.exports={registerUser,login,getCurrentUser,getUsers,DeleteUser,EditUser,changeUserRole,Adduser,changeStatus,setPassword,setnewpassword}