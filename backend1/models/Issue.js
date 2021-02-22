const mongoose = require('mongoose')
const CONFIG = require('../config/config')
const Schema = mongoose.Schema

const IssueSchema = new mongoose.Schema({

    issueType:{
        type:String,
        required:true,
        enum:CONFIG.issueType
    },
    location:{
        type:String ,
        required:true,
    },
    assignedBy:{
        type:String,
    },
    status:{
        type:String,
        default:"Not completed"
    },
    description:{
        type:String
    },
    assignedto:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    },
    department:{
        type:String,
        enum:CONFIG.department,
    },



}, {timestamps: true})


IssueSchema.methods.toWeb = function () {
    let json = this.toJSON()
    json.id = this._id//this is for the front end
    return json
}

module.exports = mongoose.model('Issue', IssueSchema)
