const express = require('express')
const { model } = require('mongoose')
const router = express.Router()
const controller = require('../controllers/UserController')

router.get('/', controller.getAll)

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/update', controller.update)

router.post('/delete', controller.delete)

module.exports = router
