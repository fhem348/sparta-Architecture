const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class UserRepository {
    createUser = async (email, password, name, age, gender, image) => {
        return await prisma.user.create({
            data: {
                email,
                password,
                name,
                age,
                gender,
                image,
            },
        })
    }

    findUserByEmail = async (email) => {
        return await prisma.user.findUnique({ where: { email } })
    }

    deleteUser = async (email) => {
        return await prisma.user.delete({ where: { email } })
    }

    updateUserInfo = async (userId, name, age, gender, image) => {
        return await prisma.user.update({
            where: { userId },
            data: { name, age, gender, image },
        })
    }
}

const userRepository = new UserRepository()
module.exports = userRepository
