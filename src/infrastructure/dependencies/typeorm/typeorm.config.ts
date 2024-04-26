require("dotenv").config();
const { DataSource } = require("typeorm");

const config = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ["dist/domain/entites/**/*.entity.js"],
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
    console.error("Error during Data Source initialization", err);
  });

module.exports = { config };
