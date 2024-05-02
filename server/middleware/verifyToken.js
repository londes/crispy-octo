const jwt = require ('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {
    console.log('in our verify function')
    console.log(req.headers)
    // checking for our auth header and the Bearer indication
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        console.log('1st check')
        return res.status(401).send({ ok: false, message: 'no token provided'})
    }

    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    // we want to catch the case wehre a bad token is provided, namely lacks 'Bearer abc123' format
    if (!token)
        return res.status(401).send({ ok: false, message: 'bad or missing token' });

    jwt.verify(token, jwt_secret, ( err, succ ) => {
        if (err) {
            console.log('token verification error', err)
            return res.status(400).send({ok: false, messsage: 'token is invalid'})
        }
        req.user = succ
        console.log(req.user)
        next()
    })
}

module.exports = verifyToken