const postService = require('../service/post.service.js')
const postRepository = require('../repositories/post.repository.js')

jest.mock('../repositories/post.repository.js', () => ({
    createPost: jest.fn(),
    getPosts: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    likePost: jest.fn(),
}))

describe('Post Service', () => {
    describe('createPost', () => {
        it('should create a new post', async () => {
            const mockPost = {
                userId: 1,
                title: 'Test Post',
                image: 'test.jpg',
                content: 'Test Content',
            }
            postRepository.createPost.mockResolvedValueOnce(mockPost)

            const result = await postService.createPost(
                1,
                'Test Post',
                'test.jpg',
                'Test Content'
            )

            expect(result).toEqual(mockPost)
            expect(postRepository.createPost).toHaveBeenCalledWith(
                1,
                'Test Post',
                'test.jpg',
                'Test Content'
            )
        })
    })

    describe('getPosts', () => {
        it('should get all posts', async () => {
            const mockPosts = [
                { postId: 1, title: 'Test Post 1' },
                { postId: 2, title: 'Test Post 2' },
            ]
            postRepository.getPosts.mockResolvedValueOnce(mockPosts)

            const result = await postService.getPosts()

            expect(result).toEqual(mockPosts)
            expect(postRepository.getPosts).toHaveBeenCalled()
        })
    })

    describe('updatePost', () => {
        it('should update a post', async () => {
            const mockPost = {
                postId: 1,
                title: 'Updated Post',
                image: 'updated.jpg',
                content: 'Updated Content',
            }
            postRepository.updatePost.mockResolvedValueOnce(mockPost)

            const result = await postService.updatePost(
                1,
                1,
                'Updated Post',
                'Updated Content',
                'updated.jpg'
            )

            expect(result).toEqual(mockPost)
            expect(postRepository.updatePost).toHaveBeenCalledWith(
                1,
                1,
                'Updated Post',
                'Updated Content',
                'updated.jpg'
            )
        })
    })

    describe('deletePost', () => {
        it('should delete a post', async () => {
            const mockResult = { count: 1 }
            postRepository.deletePost.mockResolvedValueOnce(mockResult)

            const result = await postService.deletePost(1, 1)

            expect(result).toEqual(mockResult)
            expect(postRepository.deletePost).toHaveBeenCalledWith(1, 1)
        })
    })

    describe('likePost', () => {
        it('should like a post', async () => {
            const mockPost = { postId: 1, likes: [{ userId: 123 }] }
            postRepository.likePost.mockResolvedValueOnce(mockPost)

            const result = await postService.likePost(1, 1)

            expect(result).toEqual(mockPost)
            expect(postRepository.likePost).toHaveBeenCalledWith(1, 1)
        })
    })
})
