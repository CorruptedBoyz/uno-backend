const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')
const {register,login} = require('../controllers/authentication')

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/').get(authMiddleware,(req, res) => {      //TODO - Redirect game page
    res.send(`<h1>Auth Success</h1>`)
 })

router.route('/loginScreen').get((req, res) => {    // TODO - Create login page
    res.send(`<a href="/login">click to login</a>`)
 })

router.route('/game').get(authMiddleware)



module.exports = router