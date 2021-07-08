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
    username: 'rekmooablnfkfl',
    password: '070264af7b29153b1b0bd0d374fb21b2d386ed7c65e5d459aae7b149bf463c86',
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
