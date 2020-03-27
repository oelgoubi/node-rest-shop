const mongoose = require('mongoose');


// How the product looks like
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name:{ type:String, required:true},
    price:{ type:Number,required:true},
    productImage:{ type : String, required:true}
});



// now we created the table Product and we give how each row should look like
module.exports=mongoose.model('Product',productSchema);