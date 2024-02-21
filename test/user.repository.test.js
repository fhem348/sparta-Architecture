const {
    createUser,
    findUserByEmail,
    deleteUser,
    updateUserInfo,
} = require('../repositories/user.repository.js')

const { PrismaClient } = require('@prisma/client')

jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        user: {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
        },
    }
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
    }
})

describe('User Repository', () => {
    let prismaMock

    beforeAll(() => {
        prismaMock = new PrismaClient()
    })

    describe('createUser', () => {
        it('should create a new user', async () => {
            prismaMock.user.create.mockResolvedValueOnce({ userId: 1 })

            const result = await createUser(
                'test@example.com',
                'password123',
                'Test User',
                25,
                'male',
                'test.jpg'
            )

            expect(result).toEqual({ userId: 1 })
            expect(prismaMock.user.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                    age: 25,
                    gender: 'male',
                    image: 'test.jpg',
                },
            })
        })
    })

    describe('findUserByEmail', () => {
        it('should find a user by email', async () => {
            const mockUser = { userId: 1, email: 'test@example.com' }
            prismaMock.user.findUnique.mockResolvedValueOnce(mockUser)

            const result = await findUserByEmail('test@example.com')

            expect(result).toEqual(mockUser)
            expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            })
        })
    })

    describe('deleteUser', () => {
        it('should delete a user by email', async () => {
            prismaMock.user.delete.mockResolvedValueOnce({ userId: 1 })

            const result = await deleteUser('test@example.com')

            expect(result).toEqual({ userId: 1 })
            expect(prismaMock.user.delete).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            })
        })
    })

    describe('updateUserInfo', () => {
        it('should update user information', async () => {
            prismaMock.user.update.mockResolvedValueOnce({ userId: 1 })

            const result = await updateUserInfo(
                1,
                'Updated User',
                30,
                'female',
                'updated.jpg'
            )

            expect(result).toEqual({ userId: 1 })
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { userId: 1 },
                data: {
                    name: 'Updated User',
                    age: 30,
                    gender: 'female',
                    image: 'updated.jpg',
                },
            })
        })
    })
})
