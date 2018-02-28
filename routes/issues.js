//SCHEMA OF ISSUES
var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');

/* GET issues listing. */
router.get('/', function(req, res, next) {
  Issue.find().sort('status').exec(function(err, issues) {
    if (err) {
      return next(err);
    }
    res.send(issues);
  });
});

/** 
 * GET issue by id
 * temporaire... pas sécurisé de faire findById
 * Mieux de créer un ID et de faire un findOne
 */
router.get('/:id', function(req, res, next) {
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) {
      return next(err);
    }
    res.send(issue);
  });
});

/* POST new issue */
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newIssue = new Issue(req.body);
  // Save that document
  newIssue.save(function(err, savedIssue) {
    if (err) {
      return next(err);
    }        
    // Send the saved document in the response
    res.send(savedIssue);
  });
});

/*UPDATE an issue*/
router.patch('/:id', function(req, res, next){
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) { 
      return next(err); 
    }
    else if (!issue) { 
      return res.sendStatus(404); 
    }
    issues.set(req.body);
    issues.save(function(err, updatedIssue) {
      if (err) {
        return next(err);
      }
      // Send the updated document in the response
      res.send(updatedIssue);
    })    
  });
});

/*DELETE an issue*/
router.delete('/:id', function(req, res, next) {
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) { 
      return next(err); 
    }
    else if (!issue) { 
      return res.sendStatus(404); 
    }
    Issue.deleteOne({ _id: req.params.id }, function (err) {});
    res.send(req.params.id+' has been deleted');
  });
});

module.exports = router;