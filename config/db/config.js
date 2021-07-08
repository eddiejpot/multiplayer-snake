module.exports = {
  development: {
    username: 'eddiejpot',
    password: null,
    database: 'snake_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    database: 'd55kffarh2mfmp',
    host: 'ec2-52-86-25-51.compute-1.amazonaws.com',
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: { // https://github.com/sequelize/sequelize/issues/12083
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
