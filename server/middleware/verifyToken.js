const jwt = require ('jsonwebtoken')

const verifyToken = async (req, res) => {
    console.log('in our verify function')
    console.log(req.body)
    // checking for our auth header and the Bearer indication
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer'))
        return res.status(401).send({ ok: false, message: 'no token provided'})

    const token = req.headers.authorization.split(' ')[1];
    // we want to catch the case wehre a bad token is provided, namely lacks 'Bearer abc123' format
    if (!token)
        return res.status(401).send({ ok: false, message: 'bad or missing token' });

    jwt.verify(token, jwt_secret, ( err, succ ) => {
        if (err) {
            console.log('token verification error', err)
            return res.status(400).send({ok: false, messsage: 'token is invalid'})
        }
        req.user = succ
        return res.status(200).send({ ok: true, succ })
    })
}

module.exports = verifyToken