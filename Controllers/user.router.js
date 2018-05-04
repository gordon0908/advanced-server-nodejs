const router = require('express').Router();
const User = require('../Models/user');

router.get('/', function(require, response) {
  User.find({}).exec((error, users) => {
    if (error) {
      response.json({ error });
    } else {
      response.json(users);
    }
  });
});

router.post('/create', (request, response) => {
  let { username, password, isOver21 } = request.body;

  let newUser = new User({ username, password, isOver21 });
  newUser.save((error, user) => {
    error? response.json({ error }): response.json({ user });
  });
});

router.put('/update/:uid', (request, response) => {
  let uid = request.params.uid;
  let { username, password, isOver21 } = request.body;
  User.findById(uid).then((user) => {
    if (!user) {
      return response.json({ error: 'can not find' });
    }
    user.username = username;
    user.password = password;
    user.isOver21 = isOver21;

    user.save((error, user) => {
      error? response.json({ error }): response.json({ user });
    });

  }).catch(error => response.json({ error }));

});

router.delete('/delete/:uid', (request, response) => {
  let uid = request.params.uid;
  User.findByIdAndRemove(uid).then(error => {
    if (error) {
      response.json({ error: 'can not find'})
    } else {
      response.json({ msg: uid + ' user deleted'})
    }
  })
  .catch(error => response.json({ error }));
});

module.exports = router;