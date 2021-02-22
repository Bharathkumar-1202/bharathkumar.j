const Issue = require('../models/Issue')
const { to, ReE, ReS } = require('../services/util.service')
const CONFIG = require('../config/config')
const { isNull } = require('../services/util.service')
const HttpStatus = require('http-status')
const validator = require('validator')
const { isEmail } = validator
const ObjectId = require('mongoose').Types.ObjectId
const notificationService = require('../services/notification.service')
const authService = require('../services/auth.service')

module.exports.CreateIssue = async (req, res) =>{
    let body= req.body;
    let err, issue
    body.department=req.user.department
    if(isNull(body.issueType)) return ReE(res, {message:'Issue type isrequired!'}, HttpStatus.BAD_REQUEST);
    if(isNull(body.location)) return ReE(res, {message:'Location is required!'}, HttpStatus.BAD_REQUEST);
    if(isNull(body.description)) return ReE(res, {message:'Description is required!'}, HttpStatus.BAD_REQUEST);
    if(body.description.length<=3) return ReE(res, {message:'Minimum 3 characters required!'}, HttpStatus.BAD_REQUEST);
    if(body.description.length>200) return ReE(res, {message:'Maximum 200 characters! '}, HttpStatus.BAD_REQUEST);
    [err, issue] = await to(Issue.create(body));
    if(err)return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    return ReS(res, {
        message: 'Issue Created',
        issue:issue,
    }, 201)

}
module.exports.update= async function (req, res) {
    let err, issue, data
    user = req.user
    data = req.body;
       [err,issue] =await to(Issue.findById(req.params.id));
            if(err)return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)

        if(!issue){
            return res.status(404).send({
                message: "Issue not found"
            });  
        }

        for (const [key, value] of Object.entries(data)) {
            console.log(`${key}: ${value}`);
            issue[key] = data[key]
          }

    [err, issue] = await to(issue.save())
    if (err) {
        return ReE(res, err, 400)
    }
    return ReS(res,
        {
            message: 'Issue User.',
            issue: issue,
        }, HttpStatus.OK,
    )
}

module.exports.GetAllIssue = async (req, res) =>{
    let err, issue
    [err, issue] = await to(Issue.find({active:true}));
    if(err)return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    return ReS(res, {
        message: 'Issues Founded',
        issue:issue,
    }, 201)

}
module.exports.GetByDepartment = async (req, res) =>{
    let err, issue
    let user=req.user;
    [err, issue] = await to(Issue.find({active:true,department:user.department}));
    if(err)return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    return ReS(res, {
        message: 'Issues Founded',
        issue:issue,
    }, 201)

}
module.exports.DeleteIssue = async (req, res) =>{
    let err, issue
    [err, issue] = await to(Issue.find({active:true,_id:req.params.id}));
    if(err)return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)
    if(!issue){
        return ReE(res,
            {message: 'Issue not found1'},
             HttpStatus.BAD_REQUEST)
    }
    
    //  issue.active=false;
     [err, issue] = await to(Issue.update({_id:req.params.id},{active:false}));
     if (err) {
         return ReE(res, err, 400)
     }
     return ReS(res,
         {
             message: 'Issue Deleted!',
         }, HttpStatus.OK,
     )

}