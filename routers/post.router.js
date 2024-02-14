const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const jwtValidate = require('../middleware/jwt-validate.middleware')
const authenticateToken = require('../middleware/authenticate.middleware')

const router = express.Router()

router.post('/post', jwtValidate, async (req, res, next) => {
    // 포스트 생성
    const { title, image, content } = req.body
    const { userId } = res.locals.user //미들웨어에 따라 수정해야 될 부분
    await prisma.post.create({
        data: {
            userId,
            title,
            image,
            content,
        },
    })
    return res
        .status(201)
        .json({ success: true, message: '업로드가 완료되었습니다.' })
})

router.get('/post', async (req, res, next) => {
    //뉴스피드의 메인이라 볼수있는 거시기
    const posts = await prisma.post.findMany({
        select: {
            postId: true,
            user: {
                select: { name: true },
            },
            title: true,
            image: true,
            content: true,
            // include: {
            //   _count: {
            //     select: { like: true, },
            //   },
            // },
            createdAt: true,
            // comment: {
            //     select: {
            //         commentId: true,
            //         CC: true,
            //         CCA: true,
            //     },
            // },
        },
    })
    return res.status(200).json({ data: posts })
})

router.patch('/:postId', jwtValidate, async (req, res, next) => {
    //수정
    try {
        const postId = req.params.postId
        const { title, content, image } = req.body
        const { userId } = res.locals.user //미들웨어에 따라 수정해야 될 부분
        if (!title || !content || !image) {
            return res.status(400).json({
                success: false,
                message: '수정사항 양식에 맞지 않습니다.',
            })
        }

        if (!postId) {
            return res
                .status(400)
                .json({ success: false, message: 'postId는 필수값입니다.' })
        }

        const userPost = await prisma.post.findFirst({
            where: {
                postId: Number(postId),
            },
        })

        if (!userPost) {
            return res
                .status(400)
                .json({ success: false, message: '존재하지 않는 Post입니다.' })
        }

        if (userPost.userId !== userId) {
            return res
                .status(400)
                .json({ success: false, message: '권한이 없습니다.' })
        }

        await prisma.post.update({
            where: {
                postId: Number(postId),
            },
            data: {
                title,
                content,
                image,
            },
        })

        return res
            .status(200)
            .json({ success: true, message: '게시글이 수정되었습니다.' })
    } catch (err) {
        res.status(401).json({
            success: false,
            message: '수정이 완료되지 않았습니다.',
        })
    }
})

router.delete('/:postId', jwtValidate, async (req, res, next) => {
    //삭제
    const user = res.locals.user //미들웨어에 따라 수정해야 될 부분
    const postId = req.params.postId
    if (!postId) {
        return res
            .status(400)
            .json({ success: false, message: 'postId는 필수값입니다.' })
    }
    const post = await prisma.post.findFirst({
        where: {
            postId: Number(postId),
        },
    })

    if (!post) {
        return res.json({
            success: false,
            message: 'postId가 존재하지 않습니다.',
        })
    }

    if (post.userId !== user.userId) {
        return res.json({ success: false, message: '권한이 없습니다.' })
    }

    await prisma.post.delete({
        where: {
            postId: Number(postId),
        },
    })
    return res.status(201).json({ success: true, message: '삭제되었습니다.' })
})

router.post('/:postId/like', jwtValidate, async (req, res, next) => {
    //좋아요
    try {
        const postId = req.params.postId
        const userId = res.locals.user //미들웨어에 따라 수정해야 될 부분
        const post = await prisma.post.findFirst({
            where: {
                postId: Number(postId),
            },
        })
        console.log(post.like)

        await prisma.post.like.forEach((likedUser) => {
            if (likedUser === userId) {
                //오류가능성 다분 이미 눌러져있을 경우를 구현
                prisma.post.like.delete({
                    userId,
                })
            }
        })

        if (post.userId === userId) {
            return res.json({
                success: false,
                message: '작성자는 좋아요를 누를 수 없습니다.',
            })
        }

        await prisma.post.insert({
            where: {
                postId: Number(postId),
            },
            data: {
                like: userId, //이거때매 좋아요 누른사람이 적용 위에서 안읽힐수도 있음! 수정가능성 다분
            },
        })
        return res
            .status(201)
            .json({ success: true, message: '좋아요가 적용되었습니다.' })
    } catch (err) {
        res.status(401).json({
            success: false,
            message: '좋아요가 적용되지 않았습니다.',
        })
    }
})

module.exports = router
