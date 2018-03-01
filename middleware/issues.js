const Issue = require('../models/issue');

function loadIssueFromParam(req, res, next){
    Issue.findById(req.params.id).exec(function(err, issue) {
      if (err) { 
        return next(err); 
      }
      else if (!issue) { 
        return res.sendStatus(404); 
      }
      else{
        req.issue = issue;
        next();
      }
    });
  }

function checkUpdatedStatus(req, res, next){
    if ('status' in req.body){        
        let itsAnError = false;

        switch(req.issue.status){
            case 'new':
                if (req.body.status === "completed"){                
                    itsAnError = true;
                }
                break;
            
            case 'inProgress':
                if (req.body.status !== "cancelled"){                
                   itsAnError = true;
                }
                break;

            case 'canceled':
                if (req.body.status !== "completed"){                
                    itsAnError = true;
                }
                break;

            case 'completed':
                itsAnError = true;
                break;

            default:
                next();
        }

        if (itsAnError) {
            let myError = new Error("You are not able to pass from \"" +req.issue.status + "\" to the status \"" + req.body.status+"\"");
            myError.type = "status";
            return next(myError);
        }
        else{
            next();
        }        
    }
    else
        next();
}
exports.loadIssueFromParam = loadIssueFromParam;
exports.checkUpdatedStatus = checkUpdatedStatus;