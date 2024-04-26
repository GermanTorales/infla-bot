import "dotenv/config";
import { DataSource } from "typeorm";

const config = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ["dist/domain/entities/**/*.entity.js"],
  synchronize: false,
  migrationsRun: false,
  migrations: ["dist/domain/entites/migrations/**/*.js"],
});

config
  .initialize()
  .then(() => {
    console.log("Data source initialized successfully");
  })
  .catch(err => {
    console.log("Datasurce error: ", err);
  });

export default config;
