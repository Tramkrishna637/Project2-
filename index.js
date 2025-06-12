const express = require('express');
const app = express();
const port = 8000;
require('dotenv').config();
const env = require('./config/envirment.js');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const logger = require('morgan');

const session = require('express-session');
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-strategy');
const passportLocal = require('./config/passport-local-strategy');
const passportgoogle = require('./config/passport-google-oauth-strategy');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket.js').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on 5000 port');

const path = require('path');
require('./config/viewhelpers.js')(app);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(expressLayouts);
app.set(' layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(logger(env.morgan.mode, env.morgan.options));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'codieal',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: env.db,
        autoRemove: 'disabled'
    }, function(err) {
        console.log(err || 'connect-mongodb setup is ok');
    }),
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});