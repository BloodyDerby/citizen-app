//MODEL OF USER
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for USER
const userSchema = new Schema({
  firstName: {
    type: String, // Type validation
    required: true, // Mandatory
    minlength: [ 2, 'firstName is too short' ], // Minimum length
    maxlength: [ 20, 'firstName is too long' ] // Maximum length
  },
  lastName: {
    type: String, // Type validation
    required: true, // Mandatory
    minlength: [ 2, 'lastName is too short' ], // Minimum length
    maxlength: [ 20, 'lastName is too long' ] // Maximum length
  },
  username: {
    type: String, // Type validation
    required: true, // Mandatory
    minlength: [ 2, 'username is too short' ], // Minimum length
    maxlength: [ 30, 'username is too long' ], // Maximum length
    unique : true
  },
  role: {  	
    type: String,    
    default: 'citizen',
    enum: ['citizen', 'manager'] // Limit valid values
  },
  createdAt: { 
    type: Date    
  }, // Default value
  updatedAt: {
    type: Date
  }
},
  {
    timestamps: true
  });

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);