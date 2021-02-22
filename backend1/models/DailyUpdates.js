const mongoose = require('mongoose')
const CONFIG = require('../config/config')
const Schema = mongoose.Schema

const DailyUpdatesSchema = new mongoose.Schema({


    description:{
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


DailyUpdatesSchema.methods.toWeb = function () {
    let json = this.toJSON()
    json.id = this._id//this is for the front end
    return json
}

module.exports = mongoose.model('DailyUpdate', DailyUpdatesSchema)
