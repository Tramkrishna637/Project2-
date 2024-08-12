const express=require('express');
const router=express.Router();
const passport=require('passport');

const postcontrollers=require('../controller/postscontroller');

router.post('/create',passport.checkAuthentication,postcontrollers.create);
router.get('/destroy/:id',passport.checkAuthentication,postcontrollers.destroy);

module.exports=router;