const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');


//prevent the user from creating an account using an existing email address

exports.user_signup =(req,res,next)=>{ 
    User.find({email:req.body.email}) // find() return an array of users 
    .exec()
    .then(user=>
        {
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
           } 



exports.user_logIn = (req,res,next)=>{
    // check if the user exist 
    User.findOne({email:req.body.email})
    .exec()
    .then((user=>{
        if(!user)
        {
            res.status(404).json({

                message:`Authentification failed .`,
                request :{
                    type : 'POST',
                    url : 'http://localhost:3000/user/signup'
            
                }
                });
        }else
        {
            // result is true if the pass is correct --> compare the user in the DB and the passed pwd
           bcrypt.compare(req.body.password,user.password,(err,result)=>{
               if(err)
               {
                   res.status(404).json({
                        message:`Authentification failed .`
                   });
                }
               if(result)
               {  // generate a jwt
                 // synchroneous version
               const token =  jwt.sign({_id:user._id,email:user.email},
                                        "secretOrPrivateKey",
                                        {expiresIn :"1h"});

                   return res.status(200).json({
                       message:'Auth successful',
                       token : token
                   });
               }

               res.status(404).json({
                  message:`Authentification failed .`
                 });
             })

        }

    }))
    .catch(err=>{
        res.status(500).json({
         error:err
        })
    })

}



exports.user_delete =(req,res,next)=>{
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
}