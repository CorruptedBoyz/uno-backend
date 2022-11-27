const express = require('express')
const router = express.Router()
const {login,register} = require('../controllers/authentication')
// const {drawCard} = require('../controllers/game')
const authMiddleware = require('../middlewares/auth')

router.route('/register').post(register)

router.route('/uno-Front-end/index.html').post(login)

router.route('/').get(authMiddleware,(req, res) => {      //TODO - Redirect game page
    res.send(`<h1>Auth Success</h1>`)
 })

router.route('/loginScreen').get((req, res) => {    // TODO - Create login page
    res.send(`<a href="/login">click to login</a>`)
 })

router.route('/game').get(authMiddleware)

//router.route('/getcard').get(drawCard)


module.exports = router
