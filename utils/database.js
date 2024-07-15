const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();
const DB = process.env.DB_CONNECT.replace(
  "<PASSWORD>",
  process.env.DB_PASSWORD
);

const sequelize = new Sequelize(DB);
module.exports=sequelize
