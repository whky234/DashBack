const express=require('express');
const app=express();
const dotenv=require('dotenv')
dotenv.config();
const Port=process.env.PORT ||3000

const authroutes=require('./Routes/Authroutes');
const userRoutes=require('./Routes/userroutes');
const productroutes=require('./Routes/Product')
const profileRoutes = require('./Routes/profileroutes');

const DbConnect=require('./Config/db');
app.use(express.json());  // ✅ This allows JSON parsing
const cors = require("cors");

const allowedOrigin = "https://imaginative-empanada-3e372f.netlify.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Must come before routes
app.options("*", cors()); // Preflight support for all routes




DbConnect();
app.use((req, res, next) => {
  console.log('Incoming request from origin:', req.headers.origin);
  next();
});


app.get('/',(req,res)=>{
  console.log('hello');
  res.send('Hello World run api');

});

app.use('/api/auth',authroutes)
app.use('/api/user',userRoutes)
app.use('/api/product',productroutes)
app.use('/api/profile', profileRoutes);





app.listen(Port,()=>{
    console.log('server is running at port 3000}');
})