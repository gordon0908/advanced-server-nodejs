const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./Models/database');
const userRouter = require('./Controllers/user.router');
const authRouter = require('./Controllers/auth.router');
const localUserRouter = require('./Controllers/localuser.router');
const passport = require('passport');
const path = require('path');
const https = require('https');
const fs = require('fs');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const cookie = require('cookie-parser');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/advanced-server-nodejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'Views'));
app.use(express.static('public'));

app.use(cookie());
app.use(session({
  secret: '2341-41-234-1-23-4-2134-231',
  store: new mongoStore({
    url: 'mongodb://localhost:27017',
    collection: 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/auth/facebook', authRouter);
app.use('/auth/localuser', localUserRouter);

app.get('/homepage', (request, response) => {
  if (request.session.user) {
    response.json({ user: request.session.user });
  }else if (request.user) {
      response.json({ user: request.user });
  } else {
    response.render('login');
  }
});

app.get('/', (request, response) => {
  response.render('index', {
    user: {
      name: 'G,T',
      friends: ['james', 'leanne'],
      date: (new Date()).toDateString()
    }
  });
});


app.use((request, response) => {
  response.json({
    status: 404,
    msg: 'no page found',
  });
});

const options = {
  cert: fs.readFileSync(path.resolve(__dirname, 'for-https', 'cert.pem')),
  key: fs.readFileSync(path.resolve(__dirname, 'for-https', 'key.pem')),
};

const server = https.createServer(options, app);

server.listen(3000, error => {
  if (error) {
    console.log('can not restart server');
  } else {
    console.log('server restarted');
  }
});
