const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createPost = async (userId, title, image, content) => {
    return await prisma.post.create({
        data: {
            userId,
            title,
            image,
            content,
        },
    })
}

const getPosts = async () => {
    return await prisma.post.findMany({
        select: {
            postId: true,
            user: {
                select: { name: true },
            },
            title: true,
            image: true,
            content: true,
            createdAt: true,
        },
    })
}

const updatePost = async (userId, postId, title, content, image) => {
    return await prisma.post.update({
        where: { postId },
        data: { title, content, image },
    })
}

const deletePost = async (userId, postId) => {
    return await prisma.post.deleteMany({ where: { userId, postId } })
}

const likePost = async (userId, postId) => {
    return await prisma.post.update({
        where: { postId },
        data: { like: { push: userId } },
    })
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
}
