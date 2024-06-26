const ObjectId = require('mongoose').Types.ObjectId
const mongoose = require('mongoose')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET

class UserController {

    async getAll(req, res) {
        try {
            const users = await User.find({})
            res.send(users)
        } catch (e) {
            console.log('error getting all users: ', e)
            res.send(e)
        }
    }

    async getUser(req, res) {
        let { userId } = req.params
        try {
            let foundUser = await User.findOne({ _id: userId })
            return foundUser 
                ? res.status(200).send({ok: true, foundUser: foundUser})
                : res.status(404).send({ok: false, message: 'user not found'})
        } catch (e) {
            console.log('error getting user: ', e)
            res.send(e)
        }
    }

    async register(req, res) {
        try {
            // destructuring our request object
            let { username, email, password, password2 } = req.body
            // make all validation checks on the back-end, too
            if (!username || !email || !password)
                return res.status(400).send({ ok: false, message: "all fields are required" })
            else if (password !== password2)
                return res.status(400).send({ ok: false, message: "passwords must match" })
            else if (!/^[A-Za-z][A-Za-z0-9]*$/.test(username))
                return res.status(400).send({ ok: false, message: 'username must contain only letters and numbers'})
            else if (!/^\S+@\S+\.\S+$/.test(email))
                return res.status(400).send({ ok: false, message: 'please enter a valid email'})
            // passes all checks
            else {
                let existing = await User.findOne({$or: [{username: username}, {email: email}]})
                // if there is a user with that username or email
                if (existing)
                    return res.status(400).send({ ok: false, message: 'username or email already exists'})
                else {
                    // create an instance of our User schema object with provided data
                    const user = new User({ username, email, password })
                    // save user to db
                    user.save()
                    const token = jwt.sign({ userId: user._id }, jwt_secret)
                    return res.status(201).send({ ok: true, token, message: 'success, user added. redirecting to todos' })
                }
            }
        } catch (e) {
            console.log('error registering user: ', e)
            res.send(e)
        }
    }

    async login(req, res) {
        // error logging in user:  Error: secretOrPrivateKey must have a value
        // at module.exports [as sign] (/var/task/server/node_modules/jsonwebtoken/sign.js:111:20)
        // at login (/var/task/server/controllers/UserController.js:90:31)
        console.log('in our login')
        try {
            // destructure request body
            let { username_email, password } = req.body
            // validation on back-end
            if ( !username_email || !password )
                return res.status(400).send({ok: false, message: 'all fields are required'})
            // build a query object to search by either username or pw
            let query = {}
            // if it's a valid email, look for email
            if (/^\S+@\S+\.\S+$/.test(username_email))
                query.email = username_email
            // if it's not a valid email, and it's a valid username
            else if (!/^\S+@\S+\.\S+$/.test(username_email) && /^[A-Za-z][A-Za-z0-9]*$/.test(username_email))
                query.username = username_email
            else
                return res.status(400).send({ok: false, message: 'a valid username or email is required'}
            )
            // find the user by username or email
            let user = await User.findOne(query)
            // if our user is not found by username/pw, or if password does not match
            if (!user || !(await user.comparePassword(password)))
                return res.status(401).send({ok: false, message: 'user not found or incorrect password'})
            const token = jwt.sign({ userId: user._id }, jwt_secret)
            return res.send({ ok: true, token, message: 'login successful. redirecting to todos' })
        } catch (e) {
            console.log('error logging in user: ', e)
            res.send(e)
        }
    }

    async delete(req, res) {
        try {
            let { username } = req.body
            if (!username)
                res.status(400).send({ok: false, message: `username is required`})
            let user = await User.findOneAndDelete({ username: username })
            console.log(user)
            user 
                ? res.status(200).send({ok: true, message: `user ${username} removed`})
                : res.status(404).send({ok: true, message: `user ${username} not found, nothing removed`})
        } catch(e) {
            console.error(e)
            res.status(500).send({ok: false, message: 'internal server error during delete'})
        }
    }

    async update(req, res) {
        // should consider implementing JWT tokens and further security here as updating is a sensitive operation
        try {
            // grab id from our request
            let { _id } = req.body
            // if there's no _id, we can't update
            if ( !_id )
                return res.status(400).send({ ok: false, message: `no id found for user update, cannot update`})
            // create a new object with all of our updates, and remove _id which we don't want here
            let updateObj = {...req.body}
            delete updateObj._id
            // locate user by ID and update according to new information provided. note that options param {new: true syntax} ensures that an updated username is always returned in our ternary statement if updated
            let user = await User.findOneAndUpdate({ _id: _id }, { $set: updateObj }, { new: true })
            user 
                ? res.status(200).send({ok: true, message: `user ${user.username} updated`})
                : res.status(404).send({ok: true, message: `user not found, nothing updated`})
        } catch(e) {
            console.log(e)
            return res.status(500).send({ok: false, message: 'internal server error during update'})
        }
    }

    async verify_token(req, res) {
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
}

module.exports = new UserController()