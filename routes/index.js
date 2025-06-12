const express=require('express');
const router=express.Router();
const homeController=require('../controller/home_controller');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/post',require('./post'));
router.use('/comment',require('./comment'));
router.use('/likes',require('./likes'));
router.use('/api',require('./api'));

// for any further routes we can access from here
//router.use("/routerName",require('./routerfile'));
console.log('router loaded');
module.exports=router;