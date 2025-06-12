// controller/likes_controller.js

const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require('../models/comment');

module.exports.toggleLike = async function(req, res){
    try{
        let likeable;
        let deleted = false;

        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        } else { // Assuming it's a Comment if not a Post
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // --- THIS IS THE CRITICAL CHECK FOR 'null' ---
        // Add this immediately after the findById calls
        if (!likeable) {
            console.log('Server Error: Likeable resource (Post or Comment) not found for ID:', req.query.id);
            // Send a 404 Not Found response to the client
            return res.status(404).json({
                message: 'Likeable resource (Post or Comment) not found on server.'
            });
        }
        // --- END OF CRITICAL CHECK ---

        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id // Ensure req.user._id is valid and the user is logged in
        });

        // if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(existingLike._id);
            await likeable.save(); // Ensure 'await' is here

            await existingLike.deleteOne();
            deleted = true;

        }else{
            // else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            await likeable.save(); // Ensure 'await' is here
        }

        // Fix for deprecated res.json(status, obj) syntax
        return res.status(200).json({
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        });

    }catch(err){
        console.log("Server Catch-all Error:", err); // Log the full error for debugging
        return res.status(500).json({
            message: 'Internal Server Error (unexpected issue)'
        });
    }
};