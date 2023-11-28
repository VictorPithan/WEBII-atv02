const { dataSource } = require("../config/datasource")
const { PhotoTagSchema } = require("../models/PhotoTagModel");
const { UserSchema } = require("../models/UserModel");


class TagController {
  

  async searchByTag(req, res) {

    try {
      const tagRepository = dataSource.getRepository(PhotoTagSchema)
      const userRepository = dataSource.getRepository(UserSchema)

      const page = req.query.page || 1;
      const perPage = 10;

      const { tagName } = req.body

      const user = await userRepository.findOne({ 
        where: { id: req.session?.user?.id || null},
      });

      const photosByTagName = await tagRepository.find({
        where: { tagName },
        relations: ['photos'],
        take: perPage,
        skip: (page - 1) * perPage,
      })

      const countPhotos = await tagRepository.count({
        where: { tagName },
      })

      return res.render('photosByTag', { user, photosByTagName, countPhotos })
    } catch (error) {
      console.log("Deu ruim")
      return res.send(error)
    }
    
  }
}

module.exports = {
  TagController
}