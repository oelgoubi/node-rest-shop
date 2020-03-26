const mongoose=require('mongoose');

// connecting the schema with product Model

const orderSchema = mongoose.Schema({
    _id     : mongoose.Schema.Types.ObjectId,
    product :{type: mongoose.Schema.Types.ObjectId, ref : 'Product',required:true},
    quantity: {type: Number,default:1}
    });


module.exports = mongoose.model('Order',orderSchema);