import { Sequelize } from "sequelize";
import 'dotenv/config'

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.URL,
    port: parseInt(process.env.PORT),
  }
);
