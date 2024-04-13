import "dotenv/config";
import { DataSource } from "typeorm";

const config = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + "./../../../**/*.entity{.ts,.js}"],
  synchronize: false,
  migrationsRun: false,
  migrations: ["migrations/**/*{.ts,.js}"],
});

config
  .initialize()
  .then(() => {})
  .catch(err => {
    console.log(err);
  });

export default config;
