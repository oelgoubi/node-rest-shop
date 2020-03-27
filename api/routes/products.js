const express = require('express');
const router = express.Router(); // use different routers 
const mongoose = require('mongoose');
var multer  = require('multer'); // body-parser for files 
// set the storage strategy
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/')
    },
    filename:function(req,file,cb)
    {
        cb(null,Date.now() +'-'+ file.originalname)
    }
});

const fileFilter = (req,file,cb)=>
{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        // accept the file 
         cb(null, true)
    }else{//reject the file
        cb(null, false)
    } 
}


const upload = multer({ storage: storage,limits : {fileSize:1024*1024*5},
fileFilter:fileFilter}); 






const Product = require('../models/product');

router.get('/',(req,res,next)=>{
   Product.find()
   .select('name price _id productImage')
   .exec()
   .then(docs=>{
       const response = {
           count : docs.length,
           products: docs.map(doc=>{
               return{
                   ...doc._doc,
                   request:{
                       type:'GET',
                       url:'http://localhost:3000/products/'+doc._id
                       
                   }
               }
           })
       }
        

       if(docs.length>=0)
       {
        res.status(200).json(response);
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


router.post('/', upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path

    });
    // store in the DB
    product.save()
    .then(result=>{

        console.log(result);
        res.status(200).send({
            message : 'Created Product successffuly',
            newProduct:{
                _id:result._id,
                name : result.name,
                price: result.price,
                request:{
                    type:'POST',
                    url :'http://localhost:3000/products/'+result._id 
                }
            }
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
    .select('_id name price productImage')
    .exec()
    .then(doc=>{
        console.log("From the DB",doc);
        doc ? 
        res.status(200).json({
            product : doc,
            request:{
                type:'GET',
                url :'http://localhost:3000/products/'
            }
        })
        :
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
       res.status(200).json({
        message:'Product Updated',
        request:{
            type:'GET',
            url :'http://localhost:3000/products/'+id
          }   
    });
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
       res.status(200).json({
           message:'Product Deleted Successfully',
           request:{
               type:'POST',
               url:'http://localhost:3000/products',
               body:{name:'String',price:'Number'}
           }
       })
   })
   .catch(err=>{
       console.log(err);
       res.status(500).json({
           error:err.message
       })
   })

})















module.exports = router;