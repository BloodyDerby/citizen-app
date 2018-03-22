//SCHEMA OF ISSUES
var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
var loadIssueFromParam = require('../middleware/issues').loadIssueFromParam;
var checkUpdatedStatus = require('../middleware/issues').checkUpdatedStatus

/**
 * @api {get} /issues Request all the issues informations
 * @apiName GetIssues
 * @apiGroup Issue
 *
 * @apiSuccess {String="new","inProgress","canceled","completed"} status Status of the issue
 * @apiSuccess {String} tags Tags to describe the issue
 * @apiSuccess {Number} _id Id of the issue
 * @apiSuccess {String} description  Detailed description of the issue
 * @apiSuccess {Number} latitude Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} longitude  Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} user The user who reported the issue
 * @apiSuccess {Date} createdAt Date of creation of the user
 * @apiSuccess {Date} updatedAt Date of update of the user
 */
router.get('/', function(req, res, next) {
  Issue.find().sort('status').exec(function(err, issues) {
    if (err) {
      return next(err);
    }    
    res.send(issues);
  });
});

/**
 * @api {get} /issues/:id Request an issue's informations
 * @apiName GetIssue
 * @apiGroup Issue
 * 
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiSuccess {String="new","inProgress","canceled","completed"} status Status of the issue
 * @apiSuccess {String} tags Tags to describe the issue
 * @apiSuccess {Number} _id Id of the issue
 * @apiSuccess {String} description  Detailed description of the issue
 * @apiSuccess {Number} latitude Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} longitude  Part of the coordinates indicating where the issue is
 * @apiSuccess {Number} user The user who reported the issue
 * @apiSuccess {Date} createdAt Date of creation of the user
 * @apiSuccess {Date} updatedAt Date of update of the user
 * 
 * @apiError (Not Found 404) IssueNotFound The <code>id</code> of the Issue was not found.
 */
router.get('/:id', function(req, res, next) {
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) {
      return next(err);
    }
    res.send(issue);
  });
});

/**
 * @api {post} /issues Create a new issue
 * @apiName PostIssue
 * @apiGroup Issue
 * @apiDescription The User's id, the latitude and longitude is required. 
 *
 *
 * @apiExample {js} Example usage:
 *             {
                "description": "This is a description",
                "latitude": 10,
                "longitude": 15,
                "user": "5a96982352340b2244823473"
               }
 * 
 * @apiSuccessExample {js} Success Response Example:
 *             {
                "description": "This is a description",
                "latitude": 10,
                "longitude": 15,
                "user": "5a96982352340b2244823473",
                "status": "new",
                "tags": [],
                "_id": "5ab3c0947547b02a24a19467",
                "createdAt": "2018-03-22T14:41:25.610Z",
                "updatedAt": "2018-03-22T14:41:25.610Z",
                "__v": 0
              }
 *
 * @apiError (Unprocessable Entity 422) IssueValidation The <code>latitude</code> or <code>longitude</code> must be a
 *                                                      The <code>user</code> must be an existing id.
 *                                                      The <code>status</code> must be "new", "inProgress", "canceled" or "completed".
 */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newIssue = new Issue(req.body);  
  if (newIssue.status != 'new')
    newIssue.status = 'new';
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }        
    // Send the saved document in the response    
    res.send(savedIssue);
  });
});


/**
 * @api {patch} /issues/:id Update an issue
 * @apiName PatchIssue
 * @apiGroup Issue
 * @apiParam {Number} id Unique identifier of the issue
 * 
 * @apiDescription You can update an issue's property.
 *
 * @apiExample {js} Example usage:
 *             {
    "status": "inProgress"
}
 * 
 * @apiSuccessExample {js} Success Response Example:
 *             {
    "status": "inProgress",
    "tags": [],
    "_id": "5ab3c23c9d4f4523182e8461",
    "latitude": 10,
    "longitude": 15,
    "user": "5a96982352340b2244823473",
    "createdAt": "2018-03-22T14:48:28.865Z",
    "updatedAt": "2018-03-22T14:57:42.107Z",
    "__v": 0
}
 *                                       
 * @apiError (Unprocessable Entity 422) IssueValidation You can update an issue on changing his status  from "new" to "inProgress" to indicate that a city employee is working on the issue,
 *                 from "new" or "inProgress" to "canceled" to indicate that a city employee has determined this is not a real issue,
 *                 or from "inProgress" to "completed" to indicate that the issue has been resolved.
 */
router.patch('/:id', loadIssueFromParam, checkUpdatedStatus, function(req, res, next){         
    req.issue.set(req.body);    
    req.issue.save(function(err, updatedIssue) {
      if (err) {
        return next(err);
      }
      // Send the updated document in the response
      res.send(updatedIssue);
    })      
});

/**
 * @api {delete} /issues/:id Delete an issue.
 * @apiName DeleteIssue
 * @apiGroup Issue
 * 
 * @apiParam {Number} id Unique identifier of the issue
 *
 * @apiSuccess {String} id Id has been deleted
 * 
 * @apiError (Not Found 404) IssueNotFound The <code>id</code> of the Issue was not found.
 */
router.delete('/:id', loadIssueFromParam, function(req, res, next) {  
    Issue.deleteOne({ _id: req.params.id }, function (err) {});
    res.send(req.params.id+' has been deleted');  
});

module.exports = router;