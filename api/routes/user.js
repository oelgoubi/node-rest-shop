const express = require('express');
const router = express.Router(); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const User = require('../models/user');


// create new user
router.post('/signup',(req,res,next)=>
{ 
    User.find({email:req.body.email}) // it return an array of users 
    .exec()
    .then(user=>{
        if(user.length>=1)   // check if the array is empty 
        {
            return res.status(409).json({
                message:'conflict ! This mail already exist'
            })
        }
        else{

            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err)
                {
                    return res.status(500).json({error:err })
                }else{
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                       email: req.body.email,
                       password: hash
                    });
        
                    user.save()
                    .then(result=>{
                        console.log(result);
                        res.status(201).json({
                            message :'user was created successfully'
                        })
                    })
                    .catch(err=>{
                        res.status(500).json({
                         error:err
                        })
                    })
                
                }
            })

          }
    })
    
  
      
});


router.delete('/:userId',(req,res,next)=>{
    User.remove({ _id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'User deleted'
        });
    })
    .catch(err=>{
        res.status(500).json({
            error : err,
            message:'the user you are trying to delete do not exist'
        })
    })
})











module.exports = router;