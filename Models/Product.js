const mongoose=require('mongoose')

const Productschema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String},
    price:{type:Number,required:true},
    category:{type:String,required:true},
    image:{type:String},
    stock:{type:Number,default:0},
    createBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}
},
{timestamps:true})

module.exports=mongoose.model('Product',Productschema)