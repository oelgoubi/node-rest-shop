const jwt = require('jsonwebtoken')



// the default middleware pattern in express
module.exports = (req,res,next)=>
{
    try{
        const token = req.headers.authorization.split(" ")[1];// split it by a whitr space to avoid Beared
        console.log(token);
        const decoded = jwt.verify(token,process.env.JWT_KEY);// throw an error if ot fails
        req.userData = decoded;
        next();// go to the newt middleware
    }catch(err){
        // unauthentificated : 401
       return res.status(401).json({
            message : 'Auth Failed'
        })
    }


}