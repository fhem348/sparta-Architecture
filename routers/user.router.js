const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()
const jwtValidate = require('../middleware/jwt-validate.middleware')
const authenticateToken = require('../middleware/authenticate.middleware')

const router = express.Router()

// 회원가입 라우터
router.post('/sign-up', async (req, res, next) => {
    const { email, password, name, age, gender, image } = req.body

    try {
        // 입력 값 유효성 검사
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ success: false, message: '모든 필드를 입력해주세요.' })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '비밀번호는 최소 6자 이상이어야 합니다.',
            })
        }

        // 이메일 중복 검사
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.',
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10) // 비밀번호 해싱

        const [user] = await prisma.$transaction(
            async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        name,
                        age,
                        gender,
                        image,
                    },
                })
                return [user]
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
            }
        )

        return res.status(201).json({ message: '회원가입이 완료되었습니다' })
    } catch (err) {
        next(err)
    }
})

// 회원가입 탈퇴
router.delete('/me', jwtValidate, async (req, res, next) => {
    try {
        const { password } = req.body

        const user = res.locals.user

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ errorMessage: '비밀번호가 일치하지 않습니다.' })
        }

        await prisma.user.delete({
            where: { email: user.email },
        })

        return res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' })
    } catch (err) {
        next(err)
    }
})

// 로그인 라우터
router.post('/sign-in', async (req, res, next) => {
    const { email, password } = req.body

    try {
        // 이메일과 비밀번호 유효성 검사
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '이메일과 비밀번호를 입력해주세요.',
            })
        }

        // 사용자 확인
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 잘못되었습니다.',
            })
        }

        // 비밀번호 일치 확인
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 잘못되었습니다.',
            })
        }

        // JWT 토큰 생성
        const accessToken = jwt.sign(
            { userId: user.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '12h' }
        )
        res.cookie('authorization', `Bearer ${accessToken}`)
        // return res.json({ success: true, accessToken })
        return res.status(200).json({ message: '로그인에 성공하였습니다.' })
    } catch (error) {
        next(err)
    }
})

router.get('/me', jwtValidate, (req, res) => {
    try {
        const user = res.locals.user

        return res.json({
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            image: user.image,
        })
    } catch (err) {
        next(err)
    }
})

router.patch('/me', jwtValidate, async (req, res, next) => {
    try {
        const user = res.locals.user
        const userId = user.userId
        const { name, age, gender, image } = req.body
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: {
                name,
                age,
                gender,
                image,
            },
        })

        return res
            .status(200)
            .json({ success: true, message: '수정완료하였습니다' })
    } catch (error) {
        next(err)
        // console.error('내 정보 수정 중 에러 발생:', error)
        // return res
        //     .status(500)
        //     .json({ success: false, message: '서버 에러가 발생했습니다.' })
    }
})

module.exports = router
