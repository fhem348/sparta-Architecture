const express = require('express')
const postController = require('../Controller/post.controller.js')
const jwtValidate = require('../middleware/jwt-validate.middleware.js')

const router = express.Router()

router.post('/', jwtValidate, postController.createPost)
router.get('/', postController.getPosts)
router.patch('/:postId', jwtValidate, postController.updatePost)
router.delete('/:postId', jwtValidate, postController.deletePost)
router.post('/:postId/like', jwtValidate, postController.likePost)

module.exports = router
