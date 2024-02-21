const userService = require('../service/user.service.js')
const userRepository = require('../repositories/user.repository.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../repositories/user.repository.js')

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('signUp', () => {
        it('should create a new user', async () => {
            const email = 'test@example.com'
            const password = 'password'
            const name = 'John Doe'
            const age = 30
            const gender = 'male'
            const image = 'profile.jpg'

            const hashedPassword = 'hashedPassword'
            const user = {
                email,
                password: hashedPassword,
                name,
                age,
                gender,
                image,
            }

            bcrypt.hash.mockResolvedValueOnce(hashedPassword)
            userRepository.findUserByEmail.mockResolvedValueOnce(null)
            userRepository.createUser.mockResolvedValueOnce(user)

            await expect(
                userService.signUp(email, password, name, age, gender, image)
            ).resolves.toBeUndefined()

            expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
            expect(userRepository.findUserByEmail).toHaveBeenCalledWith(email)
            expect(userRepository.createUser).toHaveBeenCalledWith(
                email,
                hashedPassword,
                name,
                age,
                gender,
                image
            )
        })

        it('should throw an error if any required field is missing', async () => {
            const email = 'test@example.com'
            const password = 'password'
            const name = ''

            await expect(
                userService.signUp(email, password, name)
            ).rejects.toThrow('모든 필드를 입력해주세요.')
        })
    })
})
