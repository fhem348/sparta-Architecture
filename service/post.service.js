const postRepository = require('../repositories/post.repository.js')

const createPost = async (userId, title, image, content) => {
    return await postRepository.createPost(userId, title, image, content)
}

const getPosts = async () => {
    return await postRepository.getPosts()
}

const updatePost = async (userId, postId, title, content, image) => {
    return await postRepository.updatePost(
        userId,
        postId,
        title,
        content,
        image
    )
}

const deletePost = async (userId, postId) => {
    return await postRepository.deletePost(userId, postId)
}

const likePost = async (userId, postId) => {
    return await postRepository.likePost(userId, postId)
}

module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
}
