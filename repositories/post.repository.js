const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class PostRepository {
    createPost = async (userId, title, image, content) => {
        return await prisma.post.create({
            data: {
                userId,
                title,
                image,
                content,
            },
        })
    }

    getPosts = async () => {
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

    updatePost = async (userId, postId, title, content, image) => {
        return await prisma.post.update({
            where: { postId },
            data: { title, content, image },
        })
    }

    deletePost = async (userId, postId) => {
        return await prisma.post.deleteMany({ where: { userId, postId } })
    }

    likePost = async (userId, postId) => {
        return await prisma.post.update({
            where: { postId },
            data: { like: { push: userId } },
        })
    }
}
const postRepository = new PostRepository()

module.exports = postRepository
