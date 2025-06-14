const User=require('../../../models/user');
const jwt=require('jsonwebtoken');
const env=require('../../../config/envirment');

module.exports.createSession=async function(req,res){
    try{
        let user= await User.findOne({email:req.body.email});
        if(!user || user.password!=req.body.password){
            return res.json(422,{
                message:"Invalid username or password",
            })
        }

        return res.json(200,{
            message:'sign is successful here is your token,please keep it safe!',
            date:{
                token:jwt.sign(user.toJSON(),env.jwt_key,{expiresIn:'100000'}),
            }
        })
    }catch(err){
        console.log('*********',err);
        return res.json(500,{
            message:"internal Server Error"
        })
    }
}