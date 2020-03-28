const express = require('express');
const router = express.Router(); 
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');


// create new user or register 
router.post('/signup',UserController.user_signup);

// login
router.post('/login',UserController.user_logIn)


router.delete('/:userId',checkAuth ,UserController.user_delete);











module.exports = router;