const { EntitySchema } = require("typeorm");

const LikeSchema = new EntitySchema({
  name: "Likes",
  tableName: 'likes',
  columns: {
    userId: {
      primary: true, 
      type: 'uuid',
    },
    photoId: {
      primary: true, 
      type: 'uuid',
    },
    username: {
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
    users: {
        type: 'many-to-one',
        target: 'user',
        
        joinColumn: {
          name: 'userId',
          referencedColumnName: 'id'
      }
    },
  }
})

module.exports = { LikeSchema }