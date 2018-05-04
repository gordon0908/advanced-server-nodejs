const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacebookUserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  facebookid: { type: String, required: false },
});

module.exports = mongoose.model('facebookusers', FacebookUserSchema);
