const queue=require('../config/kue');
const commentsMailer=require('../mailers/comment_mailers');

queue.process('emails',function(job,done){
    console.log('emails worker processing a job',job.data);

    commentsMailer.newComment(job.data);
    done();
});