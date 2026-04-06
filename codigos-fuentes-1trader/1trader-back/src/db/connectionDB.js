require('dotenv').config()
const Sequelize = require("sequelize");

let sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER_NAME_DATABASE,
    process.env.PASSWORD_USER_DATABASE,
    {
        host: process.env.HOST_NAME_DATABASE,
        dialect: 'mysql'
    }
)

module.exports = { sequelize };