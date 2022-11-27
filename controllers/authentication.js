const User = require('../models/user')
const statusCode = require('http-status-codes')

async function register(req, res) {
    const user = await User.create({...req.body})
    const token = user.createJWT()
    res.status(301).json({user: {userName: user.userName, password: user.password}, token})
}

async function login(req, res, next) {
    console.log(req.body)

    const {userName, password} = req.body

    if (!userName || !password) {
        return res.status(statusCode.UNAUTHORIZED).send('Please provide User Name and Password')
    }
    const user = await User.findOne({userName})

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return res.status(statusCode.UNAUTHORIZED).send('Wrong Password')
    }

    const token = user.createJWT()

    res.status(statusCode.OK).json({id:user._id,name:user.userName, token})

    next()

}

module.exports = {register, login}