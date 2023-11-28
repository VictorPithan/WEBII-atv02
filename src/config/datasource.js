const { DataSource } = require("typeorm");
const { UserSchema } = require("../models/UserModel");
const { join } = require("path");
const { PhotoSchema } = require("../models/PhotoModel");
const { LikeSchema } = require("../models/LikeModel");
const { TagSchema } = require("../models/TagModel");
const { PhotoTagSchema } = require("../models/PhotoTagModel");

const dataSource = new DataSource({
    type: 'sqlite',
    database: 'dados.db',
    logging: true,
    entities: [UserSchema, PhotoSchema, LikeSchema, TagSchema, PhotoTagSchema], // TBM DA PARA PASSAR UM CORINGA COM PASTAS
    migrations: [ join(__dirname, '..', '..', '**', 'migrations/*.js')]
}) 

module.exports = { dataSource };
