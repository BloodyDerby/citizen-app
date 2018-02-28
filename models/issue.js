//MODEL OF ISSUE
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var idvalidator = require('mongoose-id-validator');

// Define a schema for ISSUE
const issueSchema = new Schema({
  status: { 
    type:String,
    default: "new",
    validate: {
      // Returns the value if the status is valid (in lower case)
      validator: function(value) {
        //if(value !== "new" || value !== "inProgress" || value !== "canceled" || value !== "completed"))
        if(["new","inProgress","canceled","completed"].includes(value))
          return true;
        else return false;
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
    required: true,
    type:Number
  },
  longitude: { 
    required: true,
    type:Number
  },
  tags: {
    type:[String]
  },
  user: { // Id de l'user qui aura l'issue
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
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

issueSchema.plugin(idvalidator);
// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);