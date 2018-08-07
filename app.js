const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//Connect To MangoDB DataBase Using Magoose
mongoose.connect(config.database, { useMongoClient: true });
db = mongoose.connection;

//Check Connection
db.once('open', function(){
    console.log('Connected to MongoDB');
})

//Check for DB Errors
db.on('Error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Set The Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session MiddleWare
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(params, msg, value){
        var namespace = params.split('.')
        ,root = namespace.shift()
        ,formParam = root;

        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value
        };
    }
}));

//Passport config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//CReate Global User Variable
app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Get Article Model
let Article = require('./models/article');
//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Routes for the app
app.get('/', function(req,res){
        Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
            res.render('index', {articles:articles});
        }
    });
});

//Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);
//User Route Files
let users = require('./routes/users');
app.use('/users', users);


//Start the server
app.listen(3000, function(){
    console.log('Server started port 3000');
})