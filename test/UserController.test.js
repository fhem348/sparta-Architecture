const UserController = require('../Controller/user.controller.js')
const UserService = require('../service/user.service.js')
const bcrypt = require('bcrypt')

jest.mock('../service/user.service.js')

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('signUp', () => {
        it('should sign up a new user', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password',
                    name: 'Test User',
                    age: 25,
                    gender: 'male',
                    image: 'profile.jpg',
                },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()

            UserService.signUp.mockResolvedValue()

            await UserController.signUp(req, res, next)

            expect(UserService.signUp).toHaveBeenCalledWith(
                req.body.email,
                req.body.password,
                req.body.name,
                req.body.age,
                req.body.gender,
                req.body.image
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                message: '회원가입이 완료되었습니다.',
            })
        })

        it('should handle invalid input', async () => {
            const req = {
                body: {},
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()

            await UserController.signUp(req, res, next)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: '모든 필드를 입력해주세요.',
            })
        })
    })

    describe('deleteMe', () => {
        it('should delete the user', async () => {
            const hashedPassword = await bcrypt.hash('password', 10)
            const req = {
                body: {
                    password: 'password',
                },
                locals: {
                    user: {
                        email: 'test@example.com',
                        password: hashedPassword,
                    },
                },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
                locals: {},
            }
            const next = jest.fn()

            // 인증된 사용자인 것처럼 가정
            await UserController.deleteMe(req, res, next)

            expect(UserService.deleteUser).toHaveBeenCalledWith(
                res.locals.user.email
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: '회원 탈퇴가 완료되었습니다.',
            })
        })
    })
})
//왜안되 진짜
