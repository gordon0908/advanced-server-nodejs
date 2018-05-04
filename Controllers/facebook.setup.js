const passport = require('passport');
const FacebookUser = require('../Models/facebookUser');
const FacebookStrategy = require('passport-facebook').Strategy;
const apikey = require('../apikey');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userid, done) => {
  FacebookUser.findById(userid).then(user => {
    console.log(user);
    done(null, user);
  });
});


passport.use(new FacebookStrategy({
  clientID: apikey.facebook.key,
  clientSecret: apikey.facebook.secret,
  callbackURL: '/auth/facebook/redirect',
}, (accessTokey, refreshToken, profile, done) => {
  FacebookUser.findOne({ facebookid: profile.id}).then(user => {
    if (user) {
      done(null, user);
    } else {
      let newuser = new FacebookUser();
      newuser.username = profile.displayName;
      newuser.facebookid = profile.id;
      console.log(newuser)
      newuser.save().then(thenewuser => done(null, thenewuser)).catch(err => done(err));
    }
  }).catch(err => done(err));
}));
