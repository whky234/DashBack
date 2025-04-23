const moongose=require('mongoose')


const Connect=async()=>{
    try{
        await moongose.connect(process.env.MONGO_URL,{
           
        })

        console.log('moogoose Connect')
    }catch(err){
        console.log('error in connection',err);
        process.exit(1)
    }
}

module.exports=Connect