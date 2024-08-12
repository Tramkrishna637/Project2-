const fs=require('fs');
const path=require('path');

const User=require('../models/user');
// module.exports.profile=async (req,res)=>{
//     if(req.cookies.user_id){
//         const user=await User.findById(req.cookies.user_id).exec();
//         if(user){
//             return res.render('user_profile',{
//                 user:user
//             });
//         }
//         return res.redirect('/users/signin');

//     }
//     return res.redirect('/users/signin');
// }
module.exports.profile = function(req, res){
    User.findById(req.params.id).exec().then(user=>{
        return res.render('user_profile', {
            profile_user:user

        })
    })
    
}

module.exports.update=async function(req,res){
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body).exec().then(user=>{
    //         return res.redirect('back');
    //     })
    // }
    // else{
    //     return res.status(401).send('unauthorised');
    // }
    if(req.user.id==req.params.id){
        try{
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('*****multer error:',err);
                }
                user.name=req.body.name;
                user.email=req.body.email;
                if(req.file){
                    // if(user.avatar){
                    //     fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    // }
                    // this is saving the path of uploaded file into the avatar field in the user
                    user.avatar=User.avatarPath+'/'+req.file.filename; 
                }
                user.save();
                return res.redirect('back');

            })
        }catch(err){
            req.flash('error',err);
        return res.redirect('back');
        }

    }else{
        req.flash('error','unauthorised');
        return res.status(401).send('unauthorised');
    }
    
}
// render the signup page

module.exports.signup=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile/:id');
    }
    return res.render('user_signup',{
        title:'codieal signup'
    });
}
//render the signin page
module.exports.signin=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signin',{
        title:'codieal signin'
    });
}

//GET THE SIGN UP DATA

module.exports.create = async(req, res)=>{
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    try
    {
        const user=await User.findOne({email: req.body.email}).exec();
        if (!user){
            const newuser=await User.create(req.body);
            return res.redirect('/users/signin');
        }else{
            return res.redirect('back');
        }

    }catch (err) {
        console.log('Error in finding user or signing up:', err);
        return res.redirect('/');
    }
}

module.exports.createSession=function(req,res){
    // const user=await User.findOne({email:req.body.email}).exec();
    // if(user){
    //    if(user.password!=req.body.password){
    //     return res.redirect('/users/signin');
    //    } 
    //    res.cookie('user_id',user.id);
    //    return res.redirect('/users/profile');

    // }
    // else{
    //     return res.redirect('back');
    // }
    req.flash('success','loggged in successfully');
    return res.redirect('/');
}
module.exports.destroySession=function(req,res){
    req.logout((err) => {
        if (err) {
          // Handle error, such as redirecting to an error page or sending an error response.
          console.error('Error during logout:', err);
          res.status(500).send('Error during logout');
        } else {
          // Logout was successful, you can redirect the user or send a response as needed.
          req.flash('success','you have logged out');
          res.redirect('/');
        }
      });
}