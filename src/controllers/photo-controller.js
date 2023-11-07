const bcrypt = require('bcrypt');
const { dataSource } = require('../config/datasource');
const { PhotoSchema } = require('../models/PhotoModel');
const { UserSchema } = require('../models/UserModel');
const { formidable } = require('formidable');

class PhotoController {

    async pageHome(req, res) {
      const userRepository = dataSource.getRepository(UserSchema)

      const user = await userRepository.findOne({ 
        where: { id: req.session?.user?.id || null},
        relations: [ 'photos' ]
      });

      if(user) {
        const photos = user.photos
        return res.status(200).render('home', { photos })
      }

      res.status(400).send('Bad request - missing user login');
    }
    
    async pageAddPhoto(req, res) {
      res.status(200).render('add-photo');
    }

    async addPhoto(req, res) {
      const userId = req.session?.user?.id;
      console.log({userId})
      const form = formidable({
          uploadDir: 'public/uploads'
      });

      form.parse(req, async (err, fields, files) => {
          if (err) {
              next(err);
              return;
          }

          let title, description, url;
          title = fields.title[0];
          description = fields.description[0];
          url = files["file-upload"][0].newFilename;


          const photoRepository = dataSource.getRepository(PhotoSchema)

          const photo = photoRepository.create({
            title,
            description,
            url,
            userId,
          })

          photoRepository.save(photo)

          res.status(201).redirect('/home');
      });
    }

}

module.exports = {
    PhotoController
}