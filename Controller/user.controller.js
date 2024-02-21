const userService = require('../service/user.service.js')
const bcrypt = require('bcrypt')

const signUp = async (req, res, next) => {
    try {
        const { email, password, name, age, gender, image } = req.body

        // 사용자 등록 로직
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

        await userService.signUp(email, password, name, age, gender, image)

        res.status(201).json({ message: '회원가입이 완료되었습니다.' })
    } catch (error) {
        next(error)
    }
}

const deleteMe = async (req, res, next) => {
    try {
        const { password } = req.body

        // 사용자 삭제 로직
        const user = res.locals.user

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res
                .status(401)
                .json({ errorMessage: '비밀번호가 일치하지 않습니다.' })
        }

        await userService.deleteUser(user.email)

        res.status(200).json({ message: '회원 탈퇴가 완료되었습니다.' })
    } catch (error) {
        next(error)
    }
}

const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // 로그인 로직
        const token = await userService.signIn(email, password)

        res.cookie('authorization', `Bearer ${token}`)
        res.status(200).json({ message: '로그인에 성공하였습니다.' })
    } catch (error) {
        next(error)
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const user = res.locals.user

        res.status(200).json({
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            image: user.image,
        })
    } catch (error) {
        next(error)
    }
}

const updateUserInfo = async (req, res, next) => {
    try {
        const user = res.locals.user
        const userId = user.userId
        const { name, age, gender, image } = req.body

        await userService.updateUserInfo(userId, name, age, gender, image)

        res.status(200).json({ success: true, message: '수정완료하였습니다' })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signUp,
    deleteMe,
    signIn,
    getUserInfo,
    updateUserInfo,
}
