const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
            
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Invalid password')
            }
            
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Age needs to be positive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true  
        }
    }],
    avatar: {
        type: Buffer
    },
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign( { _id: this._id.toString() } , 'thisisjpssite')

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

userSchema.methods.toJSON = function(){
    const data = this.toObject()

    delete data.password
    delete data.tokens
    delete data.avatar

    return data
}

userSchema.statics.findByCredentials= async (email, password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Email or password is incorrect')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Email or password is incorrect')
    }

    return user
}

//Hash Password
userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User