var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users */
router.get('/', function(req, res, next) {
  User.find().sort('lastName').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});

/* GET  one user by his pseudo */
router.get('/:id', function(req, res, next) {   
  User.findOne({ 'username': req.params.id }, function(err, user) {
    if (err) {     
      return next(err);
    }
    else if(!user) // si null undefine ou false
    {
      User.findById(req.params.id).exec(function(err, user) {
          if (err) {
            return next(err);
          }  
          else{
            res.send(user);
          }        
      });
    }
    else{
      res.send(user);
    }    
  });
});

/* POST new user */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedUser);
  });
});

/*UPDATE an user*/
router.patch('/:id', function(req, res, next){
  User.findById(req.params.id).exec(function(err, user) {
    if (err) { 
      return next(err); 
    }
    else if (!user) { 
      return res.sendStatus(404); 
    }
    user.set(req.body);
    user.save(function(err, updatedUser) {
      if (err) {
        return next(err);
      }
      // Send the updated document in the response
      res.send(updatedUser);
    })    
  });
});
module.exports = router;
