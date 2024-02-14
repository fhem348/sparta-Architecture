const express = require('express')
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const jwtValidate = require('../middleware/jwt-validate.middleware')
const authenticateToken = require('../middleware/authenticate.middleware')

const router = express.Router()

router.post('/:postId/comments', jwtValidate, async (req, res, next) => {
    try {
        const postId = req.params.postId
        const { CC } = req.body
        const { userId } = res.locals.user

        console.log(postId)
        const post = await prisma.post.findFirst({
            where: { postId: +postId },
        })
        if (!post)
            return res
                .status(404)
                .json({ message: '게시글이 존재하지 않습니다.' })

        await prisma.comment.create({
            data: {
                postId: +postId,
                userId: +userId,
                CC: CC,
            },
        })

        return res
            .status(200)
            .json({ success: true, message: '댓글이 생성되었습니다.' })
    } catch (err) {
        next(err)
    }
})

router.patch('/:commentId', jwtValidate, async (req, res, next) => {
    try {
        const commentId = req.params.commentId
        const { userId } = res.locals.user
        const { CC } = req.body
        if (!CC) {
            return res.status(400).json({
                success: false,
                message: '수정내용이 존재하지 않습니다.',
            })
        }
        const usercomment = await prisma.comment.findFirst({
            where: { commentId: +commentId },
        })
        if (!usercomment) {
            return res
                .status(400)
                .json({ success: false, message: '댓글이 존재하지 않습니다.' })
        }

        if (usercomment.userId !== userId) {
            return res
                .status(400)
                .json({ success: false, message: '권한이 없습니다.' })
        }

        await prisma.comment.update({
            where: { commentId: +commentId },
            data: {
                CC: CC,
            },
        })
        return res
            .status(200)
            .json({ success: true, message: '수정이 완료되었습니다.' })
    } catch (err) {
        next(err)
    }
})
router.delete('/:commentId', jwtValidate, async (req, res, next) => {
    const commentId = req.params.commentId
    const { userId } = res.locals.user

    const usercomment = await prisma.comment.findFirst({
        where: { commentId: +commentId },
    })

    if (!usercomment) {
        return res
            .status(400)
            .json({ success: false, message: '댓글이 존재하지 않습니다.' })
    }

    if (usercomment.userId !== userId) {
        return res
            .status(400)
            .json({ success: false, message: '권한이 없습니다.' })
    }

    await prisma.comment.delete({
        where: { commentId: +commentId },
    })
    return res
        .status(200)
        .json({ success: true, message: '삭제가 완료되었습니다.' })
})

module.exports = router
