/*-------------------------------------------*/
/* -------------------------- IMPORT MODULES */
/*-------------------------------------------*/
import sequelizePackage from 'sequelize';
import url from 'url';
import allConfig from '../../config/db/config.js';
import initPlayerModel from './player.mjs';

/*-------------------------------------------*/
/* --------------------------------- GLOBALS */
/*-------------------------------------------*/

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};
let sequelize;

/*-------------------------------------------*/
/* ------------------------------------- ENV */
/*-------------------------------------------*/

// If env is production, retrieve database auth details from the
// DATABASE_URL env var that Heroku provides us
if (env === 'production') {
  console.log(process.env);
  // Break apart the Heroku database url and rebuild the configs we need
  const { DATABASE_URL } = process.env;
  const dbUrl = url.parse(DATABASE_URL);
  const username = dbUrl.auth.substr(0, dbUrl.auth.indexOf(':'));
  const password = dbUrl.auth.substr(
    dbUrl.auth.indexOf(':') + 1,
    dbUrl.auth.length,
  );
  const dbName = dbUrl.path.slice(1);
  const host = dbUrl.hostname;
  const { port } = dbUrl;
  config.host = host;
  config.port = port;
  sequelize = new Sequelize(dbName, username, password, config);
}

// If env is not production, retrieve DB auth details from the config
else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

/*-------------------------------------------*/
/* -------------------------- INIT SEQUELIZE */
/*-------------------------------------------*/

db.Player = initPlayerModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
