const postService = require('../service/post.service.js')

const createPost = async (req, res, next) => {
    try {
        const { title, image, content } = req.body
        const { userId } = res.locals.user

        await postService.createPost(userId, title, image, content)

        res.status(201).json({
            success: true,
            message: '업로드가 완료되었습니다.',
        })
    } catch (error) {
        next(error)
    }
}

const getPosts = async (req, res, next) => {
    try {
        const posts = await postService.getPosts()

        res.status(200).json({ data: posts })
    } catch (error) {
        next(error)
    }
}

const updatePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.postId, 10) // postId를 정수로 변환
        const { title, content, image } = req.body
        const { userId } = res.locals.user

        await postService.updatePost(userId, postId, title, content, image)

        res.status(200).json({
            success: true,
            message: '게시글이 수정되었습니다.',
        })
    } catch (error) {
        next(error)
    }
}

const deletePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.postId)
        const { userId } = res.locals.user

        await postService.deletePost(userId, postId)

        res.status(200).json({
            success: true,
            message: '게시글이 삭제되었습니다.',
        })
    } catch (error) {
        next(error)
    }
}

const likePost = async (req, res, next) => {
    try {
        const { postId } = req.params
        const { userId } = res.locals.user

        await postService.likePost(userId, postId)

        res.status(201).json({
            success: true,
            message: '좋아요가 적용되었습니다.',
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
}
