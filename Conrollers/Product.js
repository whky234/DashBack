
const Product=require('../Models/Product');

//create only admin
const createProduct=async(req,res)=>{
    try {
        if (req.user.role!=='admin'){
           return res.status(401).json({message:'access denied'})
        }

        const {name,description,price,category,image,stock}=req.body;

        const product=new Product({
            name,
            description,
            price,
            category,
            image,
            stock,
            createBy:req.user.id
        });

        

      await  product.save()

      res.status(200).json({message:'product create succssfully',product})
        
    } catch (error) {
        res.status(200).json({message:'server error',error})
        console.error(error)
    }
}

const getProduct=async(req,res)=>{
    try{
        const product=await Product.find().populate('createBy','name email role');

        if(!product){
           return res.status(401).json({message:'product not found'})
        }
       
        res.status(200).json({message:'product  found',product})

        
    }catch(err){
       res.status(500).json({message:'serve error'},err)
       console.error(err)
    }
}

//update only Admin

const UpdateProduct=async(req,res)=>{

    try{
        if(req.user.role!=='admin'){
         return res.status(401).json({message:"access denied"})
        }

        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})

        if(!product){
            return res.status(403).json({message:"Product not found"})
        }

        res.status(200).json({message:'update:successfully',product})
    }catch(err){
        res.status(500).json({message:'serve error'},err)
        console.error(err)
    }
}

const deleteProduct=async(req,res)=>{
    try{
        if(req.user.role!=='admin'){
            return res.status(401).json({message:"access denied"})

        }
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(403).json({message:"not found"})

        }
        res.status(200).json({message:'delete successfully',product})

        
    }catch(err){
        res.status(500).json({message:'serve error'},err)
        console.error(err)
    }
}

module.exports={createProduct,getProduct,UpdateProduct,deleteProduct}