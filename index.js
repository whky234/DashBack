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

app.use(cors({ origin: "http://localhost:5173" }));



DbConnect();


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