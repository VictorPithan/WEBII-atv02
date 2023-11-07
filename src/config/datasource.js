const { DataSource } = require("typeorm");
const { UserSchema } = require("../models/UserModel");
const { join } = require("path");
const { PhotoSchema } = require("../models/PhotoModel");

const dataSource = new DataSource({
    type: 'sqlite',
    database: 'dados.db',
    logging: true,
    // synchronize: true,
    entities: [UserSchema, PhotoSchema], // TBM DA PARA PASSAR UM CORINGA COM PASTAS
    migrations: [ join(__dirname, '..', '..', '**', 'migrations/*.js')]
}) 

module.exports = { dataSource };

// GERA MIGRATION
// npx typeorm migration:generate ./migrations/add-user-email  -d src/config/datasource.js  --outputJs

// UTILIZANDO SCRIPTS COM NPM
// npm run migration:generate --name=add-user-photo

// RUN MIGRATION
// npx typeorm migration:run  -d src/config/datasource.js

