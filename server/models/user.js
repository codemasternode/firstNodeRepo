const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcypt = require('bcryptjs')

var Schema = mongoose.Schema
var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'It is not valid email'
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        }, token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc').toString()

    user.tokens = user.tokens.concat([{
        access, token
    }])

    return user.save().then(() => {
        return token
    })
}

userSchema.statics.findByToken = function (token) {
    var user = this
    var decoded

    try {
        decoded = jwt.verify(token, 'abc')
    } catch (error) {
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}


userSchema.statics.findByCredentials = function (email, password) {
    var user = this

    return user.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcypt.compare(password,user.password, (err,res) => {
                if(res) {
                    resolve(user)
                }else {
                    reject()
                }
            })
        })

    })
}

userSchema.pre('save', function (next) {
    var user = this

    if (user.isModified('password')) {
        bcypt.genSalt(10, (err, salt) => {
            bcypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }


})



var User = mongoose.model('User', userSchema);


module.exports = {
    User
}