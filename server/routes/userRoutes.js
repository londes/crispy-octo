const express = require('express')
const { model } = require('mongoose')
const router = express.Router()
const controller = require('../controllers/UserController')
const verifyToken = require('../middleware/verifyToken')

router.get('/', controller.getAll)

router.post('/register', controller.register)

router.post('/login', controller.login)

// router.post('/update', controller.verify_token, controller.update)
router.post('/update', controller.update) 

// router.post('/update', controller.verify_token, controller.delete)
router.post('/delete', controller.delete)

// router.post('/verify_token', verifyToken)
router.post('/verify_token', controller.verify_token)

router.get('/:userId', controller.getUser)

module.exports = router
