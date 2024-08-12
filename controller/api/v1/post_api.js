const Post=require('../../../models/post');
const Comment=require('../../../models/comment');
module.exports.index=async function(req,res){

    let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
        path:'comments',
        populate:{
          path:'user'
        }
      });
    return res.json(200,{
        message:'list of posts',
        posts:posts,
    });
}

module.exports.destroy= async function(req,res){
    try{
      let post= await Post.findById(req.params.id);
      if(post.user==req.user.id){
         post.deleteOne({ _id: req.params.id })
        await Comment.deleteMany({post:req.params.id});
  
        // if(req.xhr){
        //   return res.status(200).json({
        //     data:{
        //       post_id:req.params.id,
        //     },
        //     message:"post Deleted!"
        //   })
        // }

        // req.flash('success','Post and comment associated destroy');
        return res.json(200,{
            message:"post and associated comment deleted successfully",
        });
      }
      else{
        // req.flash('error','you cannot delete this post');
        // res.redirect('/');
        return res.json(401,{
          message:"you cannot delete this post",
        });

      // }
    }
  }catch(err){
    //   req.flash('error',err);
    console.log('*****',err);
      return res.json(500,{
        message:'internal server error',
      });
    }
  }