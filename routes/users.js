//SCHEMA OF USERS
var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

/* GET users */ //5a96884849715a1420ad38a5 Bobby 2 issues
/*router.get('/', function(req, res, next) {
  User.find().sort('lastName').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});*/
/* GET users */ //5a96884849715a1420ad38a5 Bobby 2 issues
router.get('/', function(req, res, next) {
  User.find().sort('lastName').exec(function(err, users) { //ici find donc deja tableau
    if (err) {
      return next(err);
    }
    const USER_ID = users.map(user => user._id);

    // Aggregate movies count by director (i.e. person ID)
    Issue.aggregate([
        {
          $match: { // Select only issue create by the user in our table
            user: {
              $in: USER_ID
            }
          }
    },
    {
      $group: { // Count issue by user and count it
        _id: '$user',
        issueCount: {
          $sum: 1
        }
      }
    }
    ], function(err, results) // results = resultat de l'aggregation avec match et group
      {
        console.log(results);
        //const results = [results];
        // Convert the Person documents to JSON
        const usersJSON = users.map(user => user.toJSON());
        // For each result...
        console.log(usersJSON);
        results.forEach(function(result) {
          // Get the director ID (that was used to $group)...
          const resultID = result._id.toString();
          // Find the corresponding person...
          const correspondingUser = usersJSON.find(user => user._id == resultID);
          // And attach the new property
          correspondingUser.userIssuesCount = result.issueCount;  //issueCount reprit de group
          console.log(correspondingUser);      
        });
        res.send(usersJSON);
      });
    // Send the enriched response
   //res.send(users);    
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

function sortIssueByUser(users, callback){
  if (users.length<=0){
    return callback(undefined,[]);
  }
  Issue.aggregate([
    {
      $match:{
        user:{
          $in: users.map(user => users._id)
        }
      }
    }

  ])


}

module.exports = router;
