const nodeMailer=require('../config/nodemailer');


//there is another way of exporting a method
exports.newComment=(comment)=>{
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');


    nodeMailer.transporter.sendMail({
        from:'bctiwari638@gmail.com',
        to:comment.user.email,
        subject:"new comment published",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('message sent ',info);
        return;
    });
}
