const Post=require('../models/post');
const User=require('../models/user.js');
const Comment=require('../models/comment');
const Like=require('../models/like.js');

// module.exports.create= async (req,res) => {
//     Post.create({
//         content:req.body.content,
//         user:req.user._id
//       })
//       .then(post => {
//         req.flash('success','Post Published');
//         return res.redirect('back');
//       })
//       .catch(err => {
//         req.flash('error',err);
//       });
// };
module.exports.create=async (req,res)=>{
  try{
    let post=await Post.create({
      content:req.body.content,
      user:req.user._id,
    });
    if(req.xhr){
      return res.status(200).json({
        data:{
          post:post,
        },
        message:"post created!"
      })
    }
    req.flash('success','Post published');
    return res.redirect('/');
  }catch(err){
    req.flash('error',err);
    return res.redirect('/');
  }
}
// create a post in DOM


// module.exports.destroy=function(req,res){
//   Post.findById(req.params.id).exec()
//   .then(post=>{
//     if(post.user==req.user.id){
//       post.deleteOne({ _id: req.params.id })
//        Comment.deleteMany({post:req.params.id}).exec().then(comment=>{
//         return res.redirect('/');
//        })
//     }
//     else{
//       res.redirect('/');
//     }
//   })
// };
module.exports.destroy = async function(req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('back');
    }

    if (post.user == req.user.id) {
      // Delete all likes associated with this post
      await Like.deleteMany({ likeable: post._id, onModel: 'Post' });
      await Like.deleteMany({_id:{$in:post.comments}});


      // Delete all comments associated with this post
      await Comment.deleteMany({ post: req.params.id });

      // Delete the post itself
      await Post.deleteOne({ _id: post._id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post Deleted!"
        });
      } else {
        req.flash('success', 'Post and associated comments deleted successfully');
        return res.redirect('/');
      }
    } else {
      req.flash('error', 'You are not authorized to delete this post');
      return res.redirect('back');
    }
  } catch (err) {
    console.error('Error in deleting post:', err);
    req.flash('error', err.message);
    return res.redirect('back');
  }
};
