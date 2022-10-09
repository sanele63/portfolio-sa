const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();



const app = express();

//passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').mongoURI;

// connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Mongo Connected...'))
    .catch(err => console.log(err));

//ejs middlewears
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: true }));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middlewear
app.use(passport.initialize());
app.use(passport.session());

//Connect flesh
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server IS RUNNING on  port ${PORT}`));