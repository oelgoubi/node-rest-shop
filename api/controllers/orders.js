const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');



exports.orders_get_all = (req,res,next)=>{
    Order.find()
    .select('_id product quantity')
    .populate('product','name')
    .exec()
    .then(docs=>{

        res.status(200).json({
            count : docs.length,
            orders:docs.map(doc=>{
               return{
                   ...doc._doc,
                   request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+doc._id
                    }
               }
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err.message
        })
    })
}



exports.orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId) 
    .exec()
    .then(product=>{// it succed if the ID given respect certain format so we need to check if the product exist or null
        if(!product)
        {
            res.status(404).json({ message : 'product  is out of  stock'});
        }
        const order =new Order({
            _id  : new mongoose.Types.ObjectId,
            quantity : req.body.quantity,
            product : product.productId  
        });
        return order.save(); // return a promise
        })
    .then(result=>{
               res.status(201).json({
                   message:'Order submitted',
                   createdOrder:{
                       _id:result._id,
                       quantity:result.quantity,
                       product: result.product
                   },
                   request:{
                       type:'GET',
                       url: 'http://localhost:3000/orders/'+result._id
                   }
               }) 
            })
    .catch(err=>{
        res.status(500).json({
            message:'Product not found',
            error:err
        })
        })
    }


    exports.orders_getOrderbyId =(req,res,next)=>{
        const id = req.params.orderId;
        Order.findById(id)
        .select('_id product quantity')
        .populate('product')
        .exec()
        .then(order=>{
            if(!order)
            {
                res.status(500).json({
                    message:"order don't exist"
                })
            }
            res.status(200).json({
                message : 'order was founded',
                order,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/orders'
                }
            });
    
        })
        .catch(err=>{
            res.status(500).json,({
                 error : err
            })
        })
        
    }
    
    exports.orders_delete_order=(req,res,next)=>{
        const id = req.params.orderId;
        Order.remove({_id:id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message:"order deleted successfully",
                request:{
                    type:'POST',
                    url:'http://localhost:3000/orders',
                    body:{
                        productId :'ID',
                        quantity:'Number'
                    }
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                message:'No entries found',
                error : err
            })
        })
    };
