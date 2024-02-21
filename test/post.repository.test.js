const { PrismaClient } = require('@prisma/client')

jest.mock('@prisma/client', () => {
    const mockPrismaClient = {
        post: {
            create: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            deleteMany: jest.fn(),
        },
    }
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
    }
})

const {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
} = require('../repositories/post.repository.js')

describe('Post Repository', () => {
    let prismaMock

    beforeAll(() => {
        prismaMock = new PrismaClient()
    })

    describe('createPost', () => {
        it('should create a new post', async () => {
            prismaMock.post.create.mockResolvedValueOnce({ postId: 1 })

            const result = await createPost(
                1,
                'Test Title',
                'test.jpg',
                'Test Content'
            )

            expect(result).toEqual({ postId: 1 })
            expect(prismaMock.post.create).toHaveBeenCalledWith({
                data: {
                    userId: 1,
                    title: 'Test Title',
                    image: 'test.jpg',
                    content: 'Test Content',
                },
            })
        })
    })

    describe('getPosts', () => {
        it('should get all posts', async () => {
            const mockPosts = [
                { postId: 1, title: 'Test Post 1' },
                { postId: 2, title: 'Test Post 2' },
            ]
            prismaMock.post.findMany.mockResolvedValueOnce(mockPosts)

            const result = await getPosts()

            expect(result).toEqual(mockPosts)
            expect(prismaMock.post.findMany).toHaveBeenCalled()
        })
    })

    describe('updatePost', () => {
        it('should update a post', async () => {
            prismaMock.post.update.mockResolvedValueOnce({ postId: 1 })

            const result = await updatePost(
                1,
                1,
                'Updated Title',
                'Updated Content',
                'updated.jpg'
            )

            expect(result).toEqual({ postId: 1 })
            expect(prismaMock.post.update).toHaveBeenCalledWith({
                where: { postId: 1 },
                data: {
                    title: 'Updated Title',
                    content: 'Updated Content',
                    image: 'updated.jpg',
                },
            })
        })
    })

    describe('deletePost', () => {
        it('should delete a post', async () => {
            prismaMock.post.deleteMany.mockResolvedValueOnce({ count: 1 })

            const result = await deletePost(1, 1)

            expect(result).toEqual({ count: 1 })
            expect(prismaMock.post.deleteMany).toHaveBeenCalledWith({
                where: { postId: 1, userId: 1 },
            })
        })
    })

    describe('likePost', () => {
        it('should like a post', async () => {
            const mockPost = { postId: 1, likes: [] }
            prismaMock.post.update.mockResolvedValueOnce(mockPost)

            const result = await likePost(1, 1)

            expect(result).toEqual(mockPost)
            expect(prismaMock.post.update).toHaveBeenCalledWith({
                where: { postId: 1 },
                data: { likes: { connect: { userId: 123 } } },
            })
        })
    })
})
