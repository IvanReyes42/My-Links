const express = require('express');
const morgan = require('morgan');
const exphbs = require("express-handlebars");
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const mysqlstore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys')



//Inicializaciones Initializations
const app = express();
require('./lib/passport');

//Configuraciones settings
app.set("port", process.env.PORT || 5000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require('./lib/handlebars')
  })
);
app.set("view engine", ".hbs");

//Middleaware
app.use(session({
  secret:'MyLinksProyect',
  resave: false,
  saveUninitialized: false,
  store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales Global Variables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success')
    app.locals.message = req.flash('message')
    app.locals.user = req.user;
    next();
})

//Routes
app.use(require('./routers/index.js'))
app.use(require('./routers/authentication.js'))
app.use('/links',require('./routers/links.js'))

//Publicos
app.use(express.static(path.join(__dirname, 'public')))

//Empezar Starting Server
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'))
})