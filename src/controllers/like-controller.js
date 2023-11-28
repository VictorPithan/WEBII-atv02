const { dataSource } = require("../config/datasource")
const { LikeSchema } = require("../models/LikeModel")
const { UserSchema } = require("../models/UserModel")

class LikeController {
  async getListLikes(req, res) {
    const photoId = '2279c60c-a6e5-47f2-9adb-7af29dee8ef1'
    const userId = '81b78b85-6e4d-4313-a56f-87bc491d0441'

    const likeRepository = dataSource.getRepository(LikeSchema)

    const likes = await likeRepository.find({
      where: { photoId: photoId }
    })

    

    const likesCount = likes.length

    const newLikeObject = {likes:[...likes], likesCount}

    res.send(newLikeObject)
  }

  async addOrRemoveLike(req, res) {
    const likeRepository = dataSource.getRepository(LikeSchema)
    const userRepository = dataSource.getRepository(UserSchema)

    const photoId = req.params['photo_id']
    const userId = req.session?.user?.id

    if (!photoId || !userId) {
      return res.status(404).redirect('/home')
    }

    const photoLike = await likeRepository.findOne({
      where: { photoId, userId }
    })

    if(photoLike) {
      await likeRepository.delete(photoLike)
      return res.redirect(`/photo/${photoId}`)
    } else {
      const username = await userRepository.findOne({
        where: {id: userId},
        select: ['username']
      })
      const photoLiked = likeRepository.create({
        photoId,
        userId,
        username: username.username
      })

      await likeRepository.save(photoLiked)

      return res.redirect(`/photo/${photoId}`)
    }
    
  }
}

module.exports = {
  LikeController
}