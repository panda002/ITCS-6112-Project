/**
 * Index controller to control all the regular routes like home page, about, contact
 * */
const express = require("express");
const router = express.Router();

router.get('/', function (req, res) {
    if (req.session.theUser) {
        res.render('index', {user: req.session.theUser});
    }else{
        res.render('index', {user: req.session.theUser})
    }
});

router.get('/contact', function (req, res) {
    if (req.session.theUser) {
        res.render('contact', {user: req.session.theUser});
    }else{
        res.render('contact', {user: req.session.theUser})
    }
});

router.get('/about', function (req, res) {
    if (req.session.theUser) {
        res.render('about', {user: req.session.theUser});
    }else{
        res.render('about', {user: req.session.theUser})
    }
});

router.get('/*', function (req, res) {
    if (req.session.theUser) {
        res.render('index', {user: req.session.theUser});
    }else{
        res.render('index', {user: req.session.theUser})
    }
});

module.exports = router;