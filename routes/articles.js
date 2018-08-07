const express = require('express');
const router = express.Router();
const dateFormat = require('dateformat');
const now = new Date();

//Get Article Model
let Article = require('../models/article');
//Get User Model
let User = require('../models/user');

//Article Route
router.get('/add', ensureAuthenticate, function(req,res){
    res.render('add_article');
});

//Add Data To The Database POST method
router.post('/add', function(req,res){
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    let errors = req.validationErrors();

    if(errors){
        res.render('add_article',{
            errors:errors 
        });
    }else{
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
        article.date = dateFormat(now);
    //Save Data to the database
        article.save(function(err){
            if(err){
                console.log("Something went wrong.");
                return;
            }else{
                req.flash('success', 'Article Added Succesfuly.');
                res.redirect('/');
            }
        });
    }
});

//Get Single Article Route
router.get('/:id', function(req,res){
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err, user){
            res.render('article',
                {
                    article:article,
                    author: user.name
                });
        });
    })
});

//Show Single Article Form Route
router.get('/edit/:id', ensureAuthenticate, function(req,res){
    Article.findById(req.params.id, function(err, article){
        if(article.author != req.user._id){
            req.flash('danger', 'You are not authorized to perform this.');
            res.redirect('/');
        }else{
            res.render('edit_article',{article:article});
        }
    })
});

//Edit Data To The Database POST method
router.post('/edit/:id', function(req,res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.date = Date();

    let query = {_id:req.params.id}
//Save Data to the database
    Article.update(query, article, function(err){
        if(err){
            console.log("Something went wrong.");
            return;
        }else{
            req.flash('success', 'Article Updated Succesfuly.');
            res.redirect('/');
        }
    });
});

//Delete Request
router.delete('/:id', function(req,res){
    let query = {_id:req.params.id}
    Article.remove(query, function(err){
        if(err){
            return;
        }else{
            res.send("Record Deleted.");
        }
    })
});

//Access Control
function ensureAuthenticate(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
};

module.exports = router;