const mongoose=require('mongoose');
const {Schema} = mongoose;

const postSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
    ///Users/ramkrishnatiwari/Desktop/project1/uploads/users
},{
    timestamps:true
});
const Post=mongoose.model('Post',postSchema);
module.exports=Post;