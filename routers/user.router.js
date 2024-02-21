const express = require('express')
const userController = require('../Controller/user.controller.js')
const jwtValidate = require('../middleware/jwt-validate.middleware.js')

const router = express.Router()

router.post('/sign-up', userController.signUp)
router.delete('/me', jwtValidate, userController.deleteMe)
router.post('/sign-in', userController.signIn)
router.get('/me', jwtValidate, userController.getUserInfo)
router.patch('/me', jwtValidate, userController.updateUserInfo)

module.exports = router
