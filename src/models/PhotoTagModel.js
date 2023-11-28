const { EntitySchema } = require("typeorm");

const PhotoTagSchema = new EntitySchema({
  name: "PhotoTag",
  tableName: 'photo_tag',
  columns: {
    tagId: {
      primary: true, 
      type: 'uuid',
    },
    photoId: {
      primary: true, 
      type: 'uuid',
    },
    tagName: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
  },
  relations: {
    photos: {
      type: 'many-to-one',
      target: 'photo',
      joinColumn: {
        name: 'photoId',
        referencedColumnName: 'id'
      }
    },
    tags: {
        type: 'many-to-one',
        target: 'tag',
        joinColumn: {
          name: 'tagId',
          referencedColumnName: 'id'
      }
    },
  }
})

module.exports = { PhotoTagSchema }