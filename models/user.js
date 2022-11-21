const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
})

UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {id:this._id,userName: this.userName},
        process.env.JWT_SECRET,
        {expiresIn: "30d"}
    )
}
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch= await bcrypt.compare(candidatePassword, this.password)
         if(isMatch){
             return isMatch
         }
         else{
             return 'Wrong Password'
         }
}

module.exports = mongoose.model('User', UserSchema)