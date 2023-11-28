const { EntitySchema } = require("typeorm");

const TagSchema = new EntitySchema({
  name: "Tag",
  tableName: 'tag',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid'
    },
    tagName: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
  },
  relations: {
    photoTag: {
      type: 'one-to-many',
      target: 'photo_tag',
      inverseSide: 'tag',
    },
  }
})

module.exports = { TagSchema }