const mongoose=require('mongoose');
const env=require('./envirment');

mongoose.connect(`${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});
module.exports = db;