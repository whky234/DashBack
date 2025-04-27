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

// Enable CORS for your frontend domain
const corsOptions = {
  origin: 'https://productsdash.netlify.app',  // Your Netlify app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers you want to allow
};

app.use(cors(corsOptions));

DbConnect();
app.use((req, res, next) => {
  console.log('Incoming request from origin:', req.headers.origin);
  next();
});


app.get('/',(req,res)=>{
  console.log('hello');
  res.send('Hello World run api master');

});

app.use('/api/auth',authroutes)
app.use('/api/user',userRoutes)
app.use('/api/product',productroutes)
app.use('/api/profile', profileRoutes);





app.listen(Port,()=>{
    console.log('server is running at port 3000}');
})