const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isOver21: { type: Boolean, required: false }
});

module.exports = mongoose.model('users', UserSchema);
