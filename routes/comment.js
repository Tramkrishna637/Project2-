const express=require('express');
const router=express.Router();
const passport=require('passport');

const commentcontrollers=require('../controller/commentscontroller');

router.post('/create',passport.checkAuthentication,commentcontrollers.create);
router.get('/destroy/:id',passport.checkAuthentication,commentcontrollers.destroy);

module.exports=router;