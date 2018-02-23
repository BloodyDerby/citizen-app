const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for ISSUE
const issueSchema = new Schema({
  status: { 
    type:String,
    default: "new",
    validate: {
      // Returns the value if the status is valid (in lower case)
      validator: function(value) {
        //if(value !== "new" || value !== "inProgress" || value !== "canceled" || value !== "completed"))
        if(!["new","inProgress","canceled","completed"].includes(value))
        return value;
      },
      // Custom error message
      message: 'the input {VALUE} should be new or inProgress or canceled or completed'
    }

  },
  description: {
    type:String,
    maxlength: 1000 // Maximum length
  },
  imageUrl: {
    type:String,
    maxlength: 500
  },
  latitude: {
    type:Number
  },
  longitude: {
    type:Number
  },
  tags: {
    type:[String]
  },
  user: {
    type:String
  },
  createdAt: { 
    type: Date, 
    default: Date.now  
  }, // Default value
  updatedAt: {
    type: Date
  }
});
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', IssueSchema);