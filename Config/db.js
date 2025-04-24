const mongoose=require('mongoose')
require('dotenv').config(); // Ensure this is the very first line

console.log("Mongo URI:", process.env.MONGO_URI);

const Connect=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
           
        })

        console.log('moogoose Connect')
    }catch(err){
        console.log('error in connection',err);
        process.exit(1)
    }
}

module.exports=Connect