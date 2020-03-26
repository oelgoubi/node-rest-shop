const express = require('express');
const router = express.Router(); 



router.get('/',(req,res,next)=>{

    res.status(200).json({
        message : 'orders were fetched'
    });
})

router.post('/',(req,res,next)=>{
     const order ={
         orderId : req.body.orderId,
         quantity : req.body.quantity
     }
    res.status(201).json({
        message : 'order was created succefully',
        order
    });
})


router.get('/:orderId',(req,res,next)=>{
     const id = req.param.orderId;
    res.status(200).json({
        message : 'order was founded',
        id
    });
})

router.delete('/:orderId',(req,res,next)=>{
    const id = req.param.orderId;
   res.status(200).json({
       message : 'order was deleted from the DB',
       id
   });
})



module.exports = router;