const express = require('express');
const router = express.Router(); // use different routers 
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/',(req,res,next)=>{
   Product.find()
   .exec()
   .then(docs=>{
       console.log(docs);
       if(docs.length>=0)
       {
        res.status(200).json(docs);
       }else{
           res.status(404).json({
               message:'No entries found'
           })
       }
      
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           message:err.message
       })
   })
})


router.post('/',(req,res,next)=>{
    
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price

    });
    // store in the DB
    product.save()
    .then(result=>{

        console.log(result);
        res.status(200).send({
            message : 'handling POST req to /products',
            newProduct:product
            });
    })
    .catch(err=>{
          console.log(err);
          res.status(500).json({
            error : err
          });
    })
   
})

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc=>{
        console.log("From the DB",doc);
        doc? res.status(200).json(doc):
        res.status(404).json({
            message:"No Valid entry found for provided ID"
        })
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:'Error or Invalid Id',
            error : err
        })
    })

    
})


router.patch('/:productId',(req,res,next)=>{
   const id=req.params.productId;
   const updateOps ={};
   for(const ops of req.body)
   {
       updateOps[ops.propName] = ops.value; // 
   }
   Product.update({_id:id},{ $set :updateOps })
   .exec()
   .then(result=>{
       console.log(result);
       res.status(200).json(result);
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           message: err.message
       })
   })
      
   
})


router.delete('/:productId',(req,res,next)=>{
    const id=req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result=>{
       res.status(200).json(result)
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error:err.message
       })
   })

})















module.exports = router;