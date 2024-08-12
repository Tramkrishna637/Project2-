const User=require('../models/user');
const Post = require('../models/post');
 // Replace 'Post' with your actual Post model
// module.exports.home = (req, res) => {
//   Post.find({})
//     .populate('user')
//     .populate({
//       path: 'comments',
//       populate: {
//         path: 'user',
//       },
//     })
//     .exec()
//     .then((posts) => {
//       User.find({}).exec().then(user=>{
//         res.render('home', { 
//           posts: posts,
//           all_users:user
//          });
//       })
//     })
//     .catch((error) => {
//       console.error('Error rendering home:', error);
//       res.status(500).send('Internal Server Error');
//     });
// };
 module.exports.home =async (req, res) => {
  // try {
  //   const posts = await Post.find({}).exec(); // Using .exec() for better handling of the promise
  //   return res.render('home', {
  //     posts: posts, // Pass the 'posts' array to the template
  //   });
  // } catch (error) {
  //   // Handle any errors that occur during the data retrieval or rendering
  //   console.error('Error rendering home:', error);
  //   return res.status(500).send('Internal Server Error');
  // }

    try {
    let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
      path:'comments',
      populate:{
        path:'user'
      },
      populate:{
        path:'likes'
      }
    }).populate('likes'); // Using .exec() for better handling of the promise
    let users=await User.find({});
    return res.render('home', { 
      posts: posts,
      all_users:users // Pass the 'posts' array to the template
    });
  } catch (err) {
    // Handle any errors that occur during the data retrieval or rendering
    console.error('Error rendering home:', err);
    return res.status(500).send('Internal Server Error');
  }
};