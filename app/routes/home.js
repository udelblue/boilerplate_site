const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
var multer  = require('multer');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
const host =process.env.HOST || 'https://localhost:';
const port = process.env.PORT || 3000;
var moment = require('moment');
var emailer = require('../utilities/email');



const owner = "me";





router.get('/', function(req, res) {
  res.render('pages/_index', {title: 'Home'});
 //res.redirect('/interview/list')
});



router.get('/empty',function(req,res){
  res.render('pages/empty', {title: 'Empty'});
});



// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;