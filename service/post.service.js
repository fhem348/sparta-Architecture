const postRepository = require('../repositories/post.repository.js')

class PostService {
    createPost = async (userId, title, image, content) => {
        return await postRepository.createPost(userId, title, image, content)
    }

    getPosts = async () => {
        return await postRepository.getPosts()
    }

    updatePost = async (userId, postId, title, content, image) => {
        return await postRepository.updatePost(
            userId,
            postId,
            title,
            content,
            image
        )
    }

    deletePost = async (userId, postId) => {
        return await postRepository.deletePost(userId, postId)
    }

    likePost = async (userId, postId) => {
        return await postRepository.likePost(userId, postId)
    }
}

const postservice = new PostService()

module.exports = postservice
