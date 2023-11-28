const bcrypt = require('bcrypt');
const { dataSource } = require('../config/datasource');
const { PhotoSchema } = require('../models/PhotoModel');
const { UserSchema } = require('../models/UserModel');
const { formidable } = require('formidable');
const { LikeSchema } = require('../models/LikeModel');
const { TagSchema } = require('../models/TagModel');
const { getManager } = require('typeorm');
const { PhotoTagSchema } = require('../models/PhotoTagModel');
const { photoValidationSchema } = require('../validators/user-validator');

class PhotoController {

    async pageHome(req, res) {
      try {
        const userRepository = dataSource.getRepository(UserSchema)
        const photoRepository = dataSource.getRepository(PhotoSchema)

        const page = req.query.page || 1;
        const perPage = 10;

        const user = await userRepository.findOne({ 
          where: { id: req.session?.user?.id || null},
        });

        const photos = await photoRepository.find({
          where: { userId: req.session?.user?.id || null },
          take: perPage,
          skip: (page - 1) * perPage,
        })

        const countPhotos = await photoRepository.count({
          where: { userId: req.session?.user?.id || null },
        })

        if(!user) {
          return res.status(400).send('Bad request - missing user login');
        }

        delete user.password

        return res.status(200).render('home', { user, photos, countPhotos })

      } catch (error) {
        return res.status(400).send('Bad request - missing user login');
      }

    }

    async pageFriendProfile(req, res) {
      try {
        const userRepository = dataSource.getRepository(UserSchema)
        const photoRepository = dataSource.getRepository(PhotoSchema)

        const page = req.query.page || 1;
        const perPage = 10;

        const user = await userRepository.findOne({ 
          where: { id: req.params.id || null},
          relations: [ 'photos' ]
        });

        const photos = await photoRepository.find({
          where: { userId: req.params.id || null },
          take: perPage,
          skip: (page - 1) * perPage,
        })

        const countPhotos = await photoRepository.count({
          where: { userId: req.params.id || null },
        })

        delete user.password

        if(!user) {
          return res.status(400).send('Bad request - missing user login');
        }

        return res.status(200).render('friend-profile', { user, photos, countPhotos })
      } catch (error) {
        return res.status(400).send('Bad request - missing user login');
      }
    }
    
    async pageAddPhoto(req, res) {
      res.status(200).render('add-photo');
    }

    async pagePhoto(req, res) {
      try {
        const userRepository = dataSource.getRepository(UserSchema)
        const photoRepository = dataSource.getRepository(PhotoSchema)
        const likeRepository = dataSource.getRepository(LikeSchema)
        const tagRepository = dataSource.getRepository(PhotoTagSchema)
        
        const photoId = req.params['photo_id']
        const userId = req.session?.user?.id

        const user = await userRepository.findOne({ 
          where: { id: userId },
        });

        const photo = await photoRepository.findOne({ 
          where: { id: photoId },
        });

        const ownerPhoto = await userRepository.findOne({ 
          where: { id: photo.userId },
        });

        const owner = userId === photo.userId ? true : false;

        const photoLike = await likeRepository.findOne({
          where: { photoId, userId }
        })

        const photoLiked = await likeRepository.find({
          where: { photoId }
        })

        console.log({photoLike})
        console.log({photoLiked})


        const tagPhoto = await tagRepository.find({
          where: { photoId },
        })

        return res.status(200).render('photo', { user, photo, owner, photoLiked, photoLike, ownerPhoto, tagPhoto });
      } catch (error) {
        return res.status(400).send('Bad request');
      }
      
    }

    async addPhoto(req, res) {
      try {
        const tagRepository = dataSource.getRepository(TagSchema);
        const photoTagRepository = dataSource.getRepository(PhotoTagSchema);
    
        const userId = req.session?.user?.id;
    
        let errors = new Object()

        const form = formidable({
          uploadDir: 'public/uploads',
        });
    
        form.parse(req, async (err, fields, files) => {

          if (!files["file-upload"]) {
            errors = { file: "Por favor, envie uma foto."}
          }

          const photoValidation = {
            title: fields.title[0],
            description: fields.description[0],
            tags: fields.tags[0],
          }

          const { value, error } = photoValidationSchema.validate(photoValidation, { abortEarly: false });
    
    
          if (error) {
            for (const err of error.details) {
                errors[err.path[0]] = err.message;
            }
          }

          if (Object.keys(errors).length > 0) {
            console.log('Log: PhotoController - Object.keys');
            return res.render('add-photo', { errors: errors });
          }
    
          const photoRepository = dataSource.getRepository(PhotoSchema);
          const photo = photoRepository.create({
            title: value.title,
            description: value.description,
            url: files["file-upload"][0].newFilename,
            userId,
            tags: value.tags,
          });
    
          const newObjectPhoto = await photoRepository.save(photo);
    
          const tagsArray = value.tags.split("#");
    
          if (tagsArray) {
            for (let i = 1; i < tagsArray.length; i++) {
              const existTag = await tagRepository.findOne({
                where: { tagName: '#' + tagsArray[i] }
              })

              console.log("Tag verificada => ", existTag)

              let tag

              if(existTag) {
                tag = await tagRepository.save(existTag);
                console.log("Tag sendo utilizada novamente", {tag})
              } else {
                const newObjectTag = tagRepository.create({ tagName: "#" + tagsArray[i] });
                tag = await tagRepository.save(newObjectTag);
                console.log("Tag sendo criada", {tag})
              }

              const newPhotoTagObject = await photoTagRepository.save({
                tagId: tag.id,
                photoId: newObjectPhoto.id,
                tagName: tag.tagName,
              });
            }
          }
          res.status(201).redirect('/home');
        });
      } catch (err) {
        return res.status(400).send('Bad request');
      }
    }

    async deletePhoto(req, res) {
      console.log('DELETE PHOTO')
      try {

        const photoRepository = dataSource.getRepository(PhotoSchema)
        const likeRepository = dataSource.getRepository(LikeSchema)
        const tagRepository = dataSource.getRepository(TagSchema)
        const photoTagRepository = dataSource.getRepository(PhotoTagSchema)

        const photoId = req.params['photo_id']
  
        const photo = await photoRepository.findOne({
          where: { id: photoId }
        })
  
        if (!photo) {
          return res.status(404).redirect('/home');
        }

        const likes = await likeRepository.find({
          where: { photoId }
        })

        for (let i = 0; i < likes.length; i++) {
          await likeRepository.delete(likes[i]) 
        }

        const photoTag = await photoTagRepository.find({
          where: { photoId }
        })

        console.log(JSON.stringify(photoTag))

        for (let i = 0; i < photoTag.length; i++) {
          console.log("Dentro do for => ", JSON.stringify(photoTag[i]))
          await photoTagRepository.delete(photoTag[i])
        }
  
        await photoRepository.delete(photo.id)
  
        res.status(200).redirect('/home')

      } catch (error) {
        return res.status(400).send('Bad request');
      }

    }
}

module.exports = {
    PhotoController
}