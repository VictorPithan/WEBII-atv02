const { EntitySchema } = require("typeorm");

const PhotoSchema = new EntitySchema({
  name: "Photo",
  tableName: 'photo',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid'
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    description: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    created_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP'
    },
    url: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    userId: {
      type: 'varchar',
      nullable: false,
    },
    tags: {
      type: 'varchar',
      nullable: true,
    }
  },
  relations: {
    user: {
        type: 'many-to-one',
        target: 'user',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        }
    },
    likes: {
      type: 'one-to-many',
      target: 'likes',
      inverseSide: 'photo',
    },
    tagsPhoto: {
      type: 'one-to-many',
      target: 'photo_tag',
      inverseSide: 'photo',
    },
  }
})

module.exports = { PhotoSchema }