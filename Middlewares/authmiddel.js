const jwt=require('jsonwebtoken');
const User=require('../Models/user');

const Protect = async (req, res, next) => {
    let token = req.headers.authorization; // ✅ Use let here
    console.log("Received Token:", token);

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    try {
        token = token.split(" ")[1]; // ✅ Extract token part only

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Ensure JWT_SECRET is correct

        req.user = await User.findById(decoded.id).select("-password"); // ✅ Fetch user without password
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        res.status(401).json({ message: "Invalid token" });
    }
};


const authorize=(...roles)=>{
    return(req,res,next)=>{
      if(!roles.includes(req.user.role)){
        return res.status(403).json({message:'access denied'})
      }
      next();
    }
}

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next(); // Allow access
    } else {
      res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
  };

module.exports={Protect,authorize,isAdmin}