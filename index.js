import { sequelize } from "./src/db.js";

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established");
  })
  .catch((e) => {
    console.log(e);
  });

