const router = require('express').Router();
const passport = require('passport');
require('./facebook.setup');

router.get('/', passport.authenticate('facebook', {
  scope: ['public_profile']
}));

router.get('/redirect', passport.authenticate('facebook'), (request, response) => {
  // response.json({
  //   msg: 'logged in'
  // })
  response.redirect('/homepage');
});

module.exports = router;
