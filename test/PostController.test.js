const PostController = require('../Controller/post.controller.js')
const PostService = require('../service/post.service.js')

jest.mock('../service/post.service.js')

describe('Post Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // createPost 함수 테스트
    describe('createPost', () => {
        it('should create a new post', async () => {
            const req = {
                body: {
                    title: 'Test Post',
                    image: 'test.jpg',
                    content: 'This is a test post.',
                },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUserId = 1
            res.locals = { user: { userId: mockUserId } }

            // createPost 함수 호출
            await PostController.createPost(req, res, next)

            expect(PostService.createPost).toHaveBeenCalledWith(
                mockUserId,
                req.body.title,
                req.body.image,
                req.body.content
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '업로드가 완료되었습니다.',
            })
        })
    })

    // getPosts 함수 테스트
    describe('getPosts', () => {
        it('should get all posts', async () => {
            // 테스트에 필요한 mock 데이터 생성
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockPosts = [
                { id: 1, title: 'Test Post 1' },
                { id: 2, title: 'Test Post 2' },
            ]
            PostService.getPosts.mockResolvedValue(mockPosts)

            await PostController.getPosts(req, res, next)

            expect(PostService.getPosts).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ data: mockPosts })
        })
    })

    // updatePost 함수 테스트
    describe('updatePost', () => {
        it('should update a post', async () => {
            // 테스트에 필요한 mock 데이터 생성
            const req = {
                params: { postId: 1 },
                body: {
                    title: 'Updated Test Post',
                    image: 'updated.jpg',
                    content: 'This is an updated test post.',
                },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUserId = 1
            res.locals = { user: { userId: mockUserId } }

            // updatePost 함수 호출
            await PostController.updatePost(req, res, next)

            // 예상 결과 확인
            expect(PostService.updatePost).toHaveBeenCalledWith(
                mockUserId,
                req.params.postId,
                req.body.title,
                req.body.content,
                req.body.image
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '게시글이 수정되었습니다.',
            })
        })
    })

    // deletePost 함수 테스트
    describe('deletePost', () => {
        it('should delete a post', async () => {
            // 테스트에 필요한 mock 데이터 생성
            const req = {
                params: { postId: 1 },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUserId = 1
            res.locals = { user: { userId: mockUserId } }

            // deletePost 함수 호출
            await PostController.deletePost(req, res, next)

            // 예상 결과 확인
            expect(PostService.deletePost).toHaveBeenCalledWith(
                mockUserId,
                req.params.postId
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '게시글이 삭제되었습니다.',
            })
        })
    })

    // likePost 함수 테스트
    describe('likePost', () => {
        it('should like a post', async () => {
            // 테스트에 필요한 mock 데이터 생성
            const req = {
                params: { postId: 1 },
            }
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()
            const mockUserId = 1
            res.locals = { user: { userId: mockUserId } }

            // likePost 함수 호출
            await PostController.likePost(req, res, next)

            // 예상 결과 확인
            expect(PostService.likePost).toHaveBeenCalledWith(
                mockUserId,
                req.params.postId
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: '좋아요가 적용되었습니다.',
            })
        })
    })
})
//왜 이건 한번에 성공이지..
