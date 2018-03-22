//SCHEMA OF USERS
var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

/**
 * @api {get} /users Request all the users informations
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {String} role Role of the user (citizen or manager)
 * @apiSuccess {Number} _id Id of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {Date} createdAt Date of creation of the user
 * @apiSuccess {Date} updatedAt Date of update of the user
 */
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

/**
 * @api {get} /users/:id Request a user's information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 * @apiParam {String} username Username of the user
 *
 * @apiSuccess {String="citizen","manager"} role Role of the user
 * @apiSuccess {Number} _id Id of the user
 * @apiSuccess {String} firstName First name of the user
 * @apiSuccess {String} lastName  Last name of the user
 * @apiSuccess {String} username Username of the user
 * @apiSuccess {Date} createdAt Date of creation of the user
 * @apiSuccess {Date} updatedAt Date of update of the user
 * 
 * @apiError (Not Found 404) UserNotFound The <code>id</code> or <code>username</code> of the User was not found.
 */
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

/**
 * @api {get} /users/:id/issues Request a user's issues
 * @apiName GetUserIssues
 * @apiGroup User
 *
 * @apiParam {Number} id Unique identifier of the user
 *
 * @apiSuccess {String="new","inProgress","canceled","completed"} status Status of the issue
 * @apiSuccess {String} tags Tags to describe the issue
 * @apiSuccess {String} description  Detailed description of the issue
 * @apiSuccess {Number} latitude Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} longitude  Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} user The user who reported the issue
 * @apiSuccess {Date} createdAt Date of creation of the user
 * @apiSuccess {Date} updatedAt Date of update of the user
 * 
 * @apiError (Not Found 404) UserNotFound The <code>id</code> or <code>username</code> of the User was not found.
 */
router.get('/:id/issues', function(req, res, next) {   
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
            Issue.find ({'user': req.params.id}, function (err, issues) {
              res.send(issues);
            })            
          }        
      });
    }    
  });
});

/**
 * @api {post} /users Create a new user
 * @apiName PostUser
 * @apiGroup User
 * @apiDescription The username, lastName and firstName is required. 
 *
 *  By default the role of a user is 'citizen', but it can be changed for 'manager'.
 *
 * @apiExample {js} Example usage:
 *             {                
                "firstName": "Test1",
                "lastName": "Test2",
                "username": "Test3"
               }
 * 
 * @apiSuccessExample {js} Success Response Example:
 *             {
                  "role": "citizen",
                  "firstName": "Test1",
                  "lastName": "Test2",
                  "username": "Test3",
                  "_id": "5ab3a3aad091cb429cf55d14",
                  "createdAt": "2018-03-22T12:38:02.344Z",
                  "updatedAt": "2018-03-22T12:38:02.344Z",
                  "__v": 0
                }
 *
 * @apiError (Conflict 409) UserExistant The <code>firstname</code> <code>lastname</code> or <code>username</code> already exists.
 * @apiError (Unprocessable Entity 422) UserValidation The <code>firstname</code> <code>lastname</code> or <code>username</code> must contains at least 2 characters.
 *                                                     The <code>role</code> must be 'citizen' or 'manager'
 */
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

/**
 * @api {patch} /users/:id Update a user
 * @apiName PatchUser
 * @apiGroup User
 * @apiParam {Number} id Unique identifier of the user
 * 
 * @apiDescription You can update the username, lastName, firstname and role of a user.
 *
 * @apiExample {js} Example usage:
 *             {                
                "firstName": "Test1"
            }
 * 
 * @apiSuccessExample {js} Success Response Example:
 *             {
                  "role": "citizen",
                  "_id": "5ab3a8d5154b314164bba7fe",
                  "firstName": "Test3",
                  "lastName": "Test2",
                  "username": "Test4",
                  "createdAt": "2018-03-22T13:00:05.130Z",
                  "updatedAt": "2018-03-22T14:14:46.312Z",
                  "__v": 0
              }
 *
 * @apiError (Not Found 404) UserNotFound The <code>id</code> or <code>username</code> of the User was not found.                                        
 * @apiError (Unprocessable Entity 422) UserValidation The <code>firstname</code> <code>lastname</code> or <code>username</code> must contains at least 2 characters.
 *                                                     The <code>role</code> must be 'citizen' or 'manager'
 */
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
