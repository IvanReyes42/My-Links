const express = require('express')
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

router.get('/add',isLoggedIn,(req,res) =>{
    res.render('links/add');
});

router.post('/add',isLoggedIn,async (req,res)=>{
    const{ title,url, description } = req.body
    const newlink ={
        title,
        url, 
        description,
        FkIdUser: req.user.id
    };
    await pool.query('Insert into links set ?',[newlink]);
    req.flash('success','Link saved successfully');
    res.redirect('/links');
});

router.get('/',isLoggedIn,async (req,res)=>{
const links = await pool.query('Select * from links where FkIdUser = ?',[req.user.id]);
res.render('links/list',{links})
});

router.get('/delete/:id',isLoggedIn, async(req,res)=>{
    const {id} = req.params;
    await pool.query('Delete from links where id = ?',[id]);
    req.flash('success','Link removed successfully')
    res.redirect('/links')
});

router.get('/edit/:id',isLoggedIn,async (req,res)=>{
    const {id} = req.params;
    const links = await pool.query('select * from links where id =?',[id]);
    res.render('links/edit',{link:links[0]})
});

router.post('/edit/:id',isLoggedIn, async(req,res) =>{
    const { id } = req.params;
    const { title, description, url} = req.body;
    const newlink ={
        title,
        url, 
        description
    };
    console.log(newlink);
    await pool.query('Update links set ? where id = ?',[newlink,id]);
    req.flash('success','Link Updated successfully')
    res.redirect('/links')
})



module.exports = router;