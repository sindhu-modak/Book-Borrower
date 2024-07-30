import { sequelize } from "./src/db.js";
import express from "express";
import insertData from "./src/Utils/insertData.js";
import borrowRouter from "./src/Routes/borrow.routes.js";
import returnRouter from "./src/Routes/returnBook.routes.js";

const app = express();
app.use(express.json());
app.use("/api/borrow",borrowRouter);
app.use("/api/return",returnRouter);

app.listen(3000, () => {
  console.log(`listening on port 3000`);
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection established");
  })
  .catch((e) => {
    console.log(e);
  });

  insertData()    
