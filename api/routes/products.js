const express = require('express');
const router = express.Router(); // use different routers 
const multer  = require('multer'); // body-parser for files 
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/products')

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


router.get('/',ProductController.products_get_all);

// express will automatically add req,res,next to the checkAuth-->
// the body-parser that return form data should be done in the beggining
router.post('/', upload.single('productImage'),checkAuth,ProductController.products_post_product)

router.get('/:productId',ProductController.products_get_productsById);

router.patch('/:productId',checkAuth,ProductController.products_update_product);

router.delete('/:productId',checkAuth,ProductController.products_delete_product);















module.exports = router;