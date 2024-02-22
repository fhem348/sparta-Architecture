const userRepository = require('../repositories/user.repository.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

class UserService {
    signUp = async (email, password, name, age, gender, image) => {
        // 입력 값 유효성 검사
        if (!email || !password || !name) {
            throw new Error('모든 필드를 입력해주세요.')
        }

        if (password.length < 6) {
            throw new Error('비밀번호는 최소 6자 이상이어야 합니다.')
        }

        // 이메일 중복 검사
        const existingUser = await userRepository.findUserByEmail(email)
        if (existingUser) {
            throw new Error('이미 사용 중인 이메일입니다.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await userRepository.createUser(
            email,
            hashedPassword,
            name,
            age,
            gender,
            image
        )
    }

    deleteUser = async (email) => {
        const user = await userRepository.findUserByEmail(email)

        if (!user) {
            throw new Error('사용자를 찾을 수 없습니다.')
        }

        await userRepository.deleteUser(email)
    }

    signIn = async (email, password) => {
        // 로그인 로직
        const user = await userRepository.findUserByEmail(email)

        if (!user) {
            throw new Error('이메일 또는 비밀번호가 잘못되었습니다.')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new Error('이메일 또는 비밀번호가 잘못되었습니다.')
        }

        // JWT 토큰 생성
        return jwt.sign(
            { userId: user.userId },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '12h',
            }
        )
    }

    updateUserInfo = async (userId, name, age, gender, image) => {
        await userRepository.updateUserInfo(userId, name, age, gender, image)
    }
}

const userService = new UserService()
module.exports = userService
