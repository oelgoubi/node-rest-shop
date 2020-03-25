const express = require('express'); // handling req much easier for us

// create an express app
const app = express();

// app.use() method called middleware--> an incoming req has to through app.use  next to move the req to another middleware
app.use((req,res,next)=>{
   res.status(200).json({
       user : 'othmane',
       message:'i will not give up'
   });
    
})



module.exports = app;