const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createUser = async (email, password, name, age, gender, image) => {
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

const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({ where: { email } })
}

const deleteUser = async (email) => {
    return await prisma.user.delete({ where: { email } })
}

const updateUserInfo = async (userId, name, age, gender, image) => {
    return await prisma.user.update({
        where: { userId },
        data: { name, age, gender, image },
    })
}

module.exports = {
    createUser,
    findUserByEmail,
    deleteUser,
    updateUserInfo,
}
