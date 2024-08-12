const passport=require('passport');

const Localstrategy=require('passport-local').Strategy;
const User=require('../models/user');

//authenticate using passport

passport.use(new Localstrategy({
    usernameField:'email',
    passReqToCallback:true
    },
     async function(req,email,password,done){
        //find the user and establish the identity
        try{
            const newuser=await User.findOne({email:email}).exec();
            if(!newuser ||newuser.password !=password){
                req.flash('error',"Invalid username/Password");
                return done(null,false);
            }
            return done(null,newuser);

        }catch (err) {
            req.flash('error',err);
            return done(err);
          }

    }
));

//serialising the user to decide which key is used to kept in the cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
});

//deserialising the user from the key in the cookies
passport.deserializeUser(async function(id,done){
    const user=await User.findById(id);
    try{
        return done(null,user);
    }catch (err) {
            console.log('error in finding user --> passport');
            return done(err);
          }
    
});

//check if the user is authenticated
passport.checkAuthentication=(req,res,next)=>{
    //if the user is signed in,then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in 
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser=(req,res,next)=>{
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;