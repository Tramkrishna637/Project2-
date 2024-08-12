const express =require('express');
const app=express();
const port=8000;
const env=require('./config/envirment.js')
const cookieParser=require('cookie-parser');
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
const logger=require('morgan');
//for session cookie
const session=require('express-session');
const passport=require('passport');
const passportJWT=require('./config/passport-jwt-strategy');
const passportLocal=require('./config/passport-local-strategy');
const passportgoogle=require('./config/passport-google-oauth-strategy');
const MongoStore= require('connect-mongo');
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_socket.js').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on 5000 port');
const path=require('path');
require('./config/viewhelpers.js')(app);

if (env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}
if (env.name == 'production'){
    app.use('/css', express.static(path.join(__dirname, env.asset_path, 'css')));
    console.log(path.join(__dirname, env.asset_path, 'css'));
}


app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(env.asset_path));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(expressLayouts);
//extract style and scripts from the sub pages into the layouts

app.set(' layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(logger(env.morgan.mode,env.morgan.options));

//setup the view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name:'codieal',
    secret:env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl:'mongodb://127.0.0.1:27017/codieal_development',
        autoRemove:'disabled'
        
    }
    ,function(err){
        console.log(err || 'connect-mongodb setup is ok');
    }),

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

/// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`error in running server:${err}`);
    }

    console.log(`server is running on port:${port}`);
});