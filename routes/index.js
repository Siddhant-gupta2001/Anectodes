// const express = require('express')
// const router = express.Router()

// // @desc       Login/ landing page
// // @route      GET/

// router.get('/', (req,res) => {
//     res.render('login')
// })

// // @desv Dashboard
// // @route  GET / dashborad

// router.get('/dashboard', (req, res) => {
//     res.render('dashborad')
// })

// module.exports = router

const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest } = require('../middleware/auth')

const Story= require('../models/Story')

// @desc       Login/ landing page
// @route      GET/

router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// @desc Dashboard
// @route GET /dashboard

router.get('/dashboard', ensureAuth, async (req, res) => {
  try{
    const stories = await Story.find({user: req.user.id}).lean()
    res.render('dashboard', {
      name: req.user.firstName, 
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', {
      errorMessage: 'Internal Server Error. Please try again later.',
    });
  }
  // console.log(req.user)
  
});
module.exports = router;
