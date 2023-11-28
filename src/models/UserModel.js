const { EntitySchema } = require("typeorm");

const UserSchema = new EntitySchema({
  name: "User",
  tableName: 'user',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid'
    },
    firstname: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    lastname: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    username: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true
    },
    email: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true
    },
    password: {
      type: 'varchar',
      length: 255,
      nullable: false
    }
  },
  relations: {
    photos: {
        type: 'one-to-many',
        target: 'photo',
        inverseSide: 'user'
    },
    likes: {
      type: 'one-to-many',
      target: 'likes',
      inverseSide: 'user'
    }
  }
})

module.exports = { UserSchema }