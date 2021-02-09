const express = require('express'); 
const app = express();
const morgan = require('morgan'); // log the req to the console 
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/shopDB',
{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

// use the logger middleware and body-parser  (execute between the req and res)
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); // serve files from this folder
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());// extract json data 


// append the response header to avoid cors erros
app.use((req,res,next)=>{
    // give acces to any client
   res.header('Access-Control-Allow-Origin','*');
   res.header('Access-Control-Allow-Header','Origin, X-Requested-With,Content-Type,Accept,Authorization');
   // browsers always send an Option req before sending post req or delete ,put 
   if(req.method === 'OPTIONS')
   {
       // all the req we wan want to support with our API
       res.header('Access-Control-Allow-Methods','PUT,DELETE,PATCH,GET,POST');
       // return bcz the Option req is just to find out the type of req
       return res.status(200).json({});
   }
   next();// move to the other router
})




// Set up Forwardars
const productRoutes= require('./api/routes/products');
const ordersRoutes= require('./api/routes/orders');
const usersRouters = require('./api/routes/user');



// app.use() method called middleware--> an incoming req has to through app.use  next to move the req to another middleware
app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);
app.use('/user',usersRouters);

// handle errors 

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error); // build another req by passing the error obj to another middleware
})

// handle errors for anywhere else DB err for ex
app.use((error,req,res,next)=>{
   res.status(error.status || 500);
   res.json({
       error:{
           message : error.message
       }
   })
})



module.exports = app;