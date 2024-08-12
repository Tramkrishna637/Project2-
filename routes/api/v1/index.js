const express=require('express');
const router=express.Router();

router.use('/post',require('./post'));
router.use('/user',require('./users'));
module.exports=router;
