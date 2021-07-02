/*-------------------------------------------*/
/* -------------------------- IMPORT MODULES */
/*-------------------------------------------*/
import sequelizePackage from 'sequelize';
import allConfig from '../../config/db/config.js';

import initPlayerModel from './player.mjs';

/*-------------------------------------------*/
/* -------------------------- INIT SEQUELIZE */
/*-------------------------------------------*/

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Player = initPlayerModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
