const Comment=require('../models/comment');
const Post=require('../models/post');
const commentMailers=require('../mailers/comment_mailers');
const commentEmailWorkers=require('../workers/comment_emailworkers');
const queue=require('../config/kue');
const Like=require('../models/like');
module.exports.create=async (req,res)=>{
    try{
      let post=await Post.findById(req.body.post);
      if(post){
        let comment=await Comment.create({
          content:req.body.content,
          post:req.body.post,
          user:req.user._id,
        });
        post.comments.push(comment);
        post.save();


        comment = await Comment.findById(comment._id).populate('user', 'name email').exec();

        //commentMailers.newComment(comment);
        let job=queue.create('emails',comment).save(function(err){
          if(err){
            console.log('error in creating queue:');
            return;
          }
          console.log(job.id);
        });
        if(req.xhr){
          
          return res.status(200).json({
            data:{
              comment:comment
            },
            message:'post created'
          });
        }

        req.flash('success','comment published');
        res.redirect('/');
      }
      
    }catch(err){
      console.log(err);
      req.flash('error',err);
      return;
    }
}

module.exports.destroy=async function(req,res){
  let comment=await Comment.findById(req.params.id);
    if(comment.user == req.user.id){
      let postId=comment.post;
       await Comment.deleteOne({ _id: comment._id });
       let post= await Post.findByIdAndUpdate(postId,{$pull:{comment:req.params.id}});

       await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
       return res.redirect('/');

    }
    else{
      return res.redirect('/');
    }
  
}

