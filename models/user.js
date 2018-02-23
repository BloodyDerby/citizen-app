const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const userSchema = new Schema({
  firstName: {
    type: String, // Type validation
    required: true, // Mandatory
    minlength: [ 2, 'firstName is too short' ], // Minimum length
    maxlength: 20 // Maximum length
  },
  lastName: {
    type: String, // Type validation
    required: true, // Mandatory
    minlength: [ 2, 'lastName is too short' ], // Minimum length
    maxlength: 20 // Maximum length
  },
  role: {  	
    type: String,
    enum: ['citizen', 'manager'] // Limit valid values
  },
  createdAt: { type: Date, default: Date.now  }, // Default value
});

module.exports = mongoose.model('User', userSchema);