const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const jwtValidate = async (req, res, next) => {
    try {
        // console.log(req.cookies)
        const authorization = req.cookies.authorization

        if (!authorization) {
            throw new Error('인증 정보가 올바르지 않습니다1.')
        }

        const [tokenType, tokenValue] = authorization.split(' ')
        if (tokenType !== 'Bearer' || !tokenValue) {
            throw new Error('인증 정보가 올바르지 않습니다2.')
        }

        const token = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET)
        if (!token.userId) {
            throw new Error('인증 정보가 올바르지 않습니다3.')
        }

        const user = await prisma.user.findUnique({
            where: {
                userId: token.userId,
            },
        })

        if (!user) {
            throw new Error('인증 정보가 올바르지 않습니다4.')
        }

        res.locals.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message,
        })
    }
}

module.exports = jwtValidate
