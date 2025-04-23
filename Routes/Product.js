const express=require('express')

const {Protect,isAdmin}=require('../Middlewares/authmiddel')
const {createProduct,getProduct,UpdateProduct,deleteProduct}=require('../Conrollers/Product');

const router = express.Router();

router.post('/createProduct',Protect,createProduct);
router.get('/getProduct',Protect,getProduct);
router.put('/update/:id',Protect,UpdateProduct)
router.delete('/delete/:id',Protect,deleteProduct)





module.exports=router