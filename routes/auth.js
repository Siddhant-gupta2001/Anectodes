const express = require('express');
const passport= require ('passport')
const router = express.Router();

// @desc       Login/ landing page
// @route      GET/

// router.get('/', (req, res) => {
//   res.render('login', {
//     layout: 'login',
//   });
// });


router.get('/google', passport.authenticate('google', {scope: ['profile']}))


// @desc Dashboard
// @route GET /dashboard

// router.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/'}),
  (req, res) => {
    res.redirect('/dashboard')
  }
)

// @desc Lougout user
// @route /auth/logout
router.get('/logout', (req,res) => {
  req.logout((error) => {
    if (error) {return next(error)}
    res.redirect('/')
  })

})

module.exports = router;