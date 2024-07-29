import {connectionDB} from "./db/index.js"
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});



connectionDB()
.then( () => {
  app.listen(process.env.PORT, () => {
    console.log(` Server is running at port http://localhost:${process.env.PORT}`);
  })
}
)
.catch( (error) => {
  console.log("mongoDB connection error!!", error)
}
)
