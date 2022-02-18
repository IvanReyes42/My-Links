const passport = require('passport');
const Localstrategy = require('passport-local').Strategy

const pool = require("../database")
const helpers = require("../lib/Helpers")

//Login y autenticacion
passport.use('local.signin',new Localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username,password,done)=>{
    
    const rows = await pool.query('Select * from users where username = ?',[username])
    if(rows.length>0){
        const user = rows[0];
         const validPassword = await helpers.matchPassword(password,user.password)
         if(validPassword){
             done(null,user,req.flash('success','Welcome '+user.username));
         }
         else{
             done(null, false, req.flash('message','Incorrect Password'));
         }
    }
    else{
       return done(null,false,req.flash('message','The username does not exist')) 
    }
}
));



//Registro y cifrado
passport.use('local.signup', new Localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const resul = await pool.query('Insert into users set ?',[newUser])
    newUser.id = resul.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const rows= await pool.query('Select * from users where id=?',[id])
    done(null,rows[0]);
})