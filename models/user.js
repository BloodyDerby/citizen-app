const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
  firstName: String,
  lastName: String,
  role: String,
  createdAt: Date
});
// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);