const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},
    role:{type:String,enum:['admin','user'],default:'user'},
    token:{type:String},
    status:{type:String,enum:['active','pending'],default:'pending'},
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
},
{timestamps:true}
)


UserSchema.pre('save',(async function (next) {
    if(!this.isModified("password"))return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
}))

UserSchema.methods.matchPassword=async function (enterpassword) {
   return await bcrypt.compare(enterpassword,this.password)
    
}


module.exports=mongoose.model('User',UserSchema)