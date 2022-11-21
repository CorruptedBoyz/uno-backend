const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("no header")
        // res.redirect('/login')  TODO - redirect to login page
        throw new Error("no header")
    }
    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {id, userName} = decoded
        req.user = {id, userName}
        next()
    } catch (error) {
        console.log(error)
    }
}

module.exports = authMiddleware