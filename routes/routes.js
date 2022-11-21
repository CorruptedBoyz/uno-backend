const express = require('express')
const router = express.Router()
const {login,register} = require('../controllers/authentication')
const {drawCard} = require('../controllers/game')
const authMiddleware = require('../middlewares/auth')

router.route('/register').post(register)

router.route('/login').post(login)

router.route('/').get( (req, res) =>{
    console. log(req. socket. remoteAddress);
    console. log(req. ip);
    res.status(200).send( req. ip);
})
// authMiddleware,(req, res) => {
//     res.send(`<h1>hello world</h1><a href="/login">click to login</a>`)
// }
router.route('/getcard').get(drawCard)


module.exports = router
