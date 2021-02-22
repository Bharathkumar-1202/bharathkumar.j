const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const bcrypt_p = require('bcrypt-promise')
const jwt = require('jsonwebtoken')
const validate = require('mongoose-validator')
const {TE, to} = require('../services/util.service')
const CONFIG = require('../config/config')
const {isNull} = require('../services/util.service')   
const mongoosePaginate = require('mongoose-paginate-v2')
var aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const Schema =  mongoose.Schema;
let UserSchema =Schema({


    name:{
        type:String,
        require:true
    },
    staffId:{
        type:String,
        unique: true,
    },
    department:{
        type:String,
        enum:CONFIG.department,
    },
    email:{
        type: String,
        lowercase: true,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
        required:true,
        validate: [
            validate({
                validator: 'isEmail',
                message: 'Not a valid email.',
            })],
            
    },
    type:{
        type:String,
        enum:CONFIG.userType, 
    },
    verifyCode:{
        type:Number,
        default:Math.floor(100000 + Math.random() * 900000),
    },
    codeVerified:{
        type:Boolean,
        default:false,
    },    
    active:{
        type:Boolean,
        default:true
    },
    password:{
        type: String 
    },
    admin:{
        type:Boolean,
        default:false
    }


},{timestamps: true})

UserSchema.pre('save', async function (next) {
    
    if (isNull(this.password)) {
        return
    }
    
    if (this.isModified('password') || this.isNew) {
        
        let err, salt, hash;
        [err, salt] = await to(bcrypt.genSalt(10))
        if (err) TE(err.message, true);
        
        [err, hash] = await to(bcrypt.hash(this.password, salt))
        if (err) TE(err.message, true)
        
        this.password = hash
        
    } else {
        return next()
    }
})

UserSchema.methods.comparePassword = async function (pw) {
    
    let err, pass
    if (!this.password) TE('password not set');
    [err, pass] = await to(bcrypt_p.compare(pw, this.password))
    if (err) TE(err)
    
    if (!pass) TE('Email/password did not match. Please try again.')
    
    return this
}

UserSchema.methods.getJWT = function () {
    let expiration_time = parseInt(CONFIG.jwt_expiration)
    return 'Bearer ' + jwt.sign({user_id: this._id}, CONFIG.jwt_encryption,
        {expiresIn: expiration_time})
}

UserSchema.methods.toWeb = function () {
    let json = this.toJSON()
    json.id = this._id//this is for the front end
    // json.password = undefined
    return json
}

UserSchema.plugin(mongoosePaginate)
UserSchema.plugin(aggregatePaginate)
module.exports=User=mongoose.model('User',UserSchema)