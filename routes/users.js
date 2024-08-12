const express=require('express');
const router=express.Router();
const passport=require('passport');

const userscontroller=require('../controller/userscontroller');

router.get('/profile/:id',passport.checkAuthentication,userscontroller.profile);
router.post('/update/:id',passport.checkAuthentication,userscontroller.update);
router.get('/signin',userscontroller.signin);
router.get('/signup',userscontroller.signup);

router.post('/create',userscontroller.create);
router.get('/sign-out',userscontroller.destroySession);
// router.post('/createSession',userscontroller.createSession);
// use passport as a middleware to authenticate
router.post('/createSession',passport.authenticate(
    'local',
    {failureRedirect:'/users/signin'}
),userscontroller.createSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),userscontroller.createSession);
module.exports=router;