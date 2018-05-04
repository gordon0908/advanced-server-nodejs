const router = require('express').Router();
const bcrypt = require('bcryptjs');
const facebookUser = require('../Models/facebookUser');
router.get('/', (request, response) => response.render('login'));

router.post('/signup', (request, response) => {
  let { username, password } = request.body;

  if (username != "" && password != "") {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return response.json({ error });
      }
      bcrypt.hash(password, salt, (error, newPswd) => {
        if (error) {
          return response.json({ error });
        }
        let newUser = new facebookUser({ username, password: newPswd });

        newUser.save((error, user) => {
          if (error) {
            return response.json({ error });
          } else {
            request.session.user = user;
            response.redirect('/homepage');
          }
        });

      })
    });

  } else {
    response.json({ msg: 'username & password required' });
  }
});

router.post('/signin', (request, response) => {
  let { username, password } = request.body;

  if (username != "" && password != "") {
    facebookUser.findOne({ username })
      .then(user => {
        bcrypt.compare(password, user.password, (error, matched) => {
          if (error) {
            return response.json({ error });
          }
          if (matched) {
            request.session.user = user;
            response.redirect('/homepage');
          } else {
            response.json({ msg: 'unmatched username password '});
          }

        });

      }).catch(error => response.json({ error }));
  } else {
    response.json({ msg: 'username & password required' });
  }
});

module.exports = router;
