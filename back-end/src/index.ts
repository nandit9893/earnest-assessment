import dotenv from "dotenv";
import app from "./app.ts";
import connectDB from "./configure/database.ts";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Monogo db conncection failed !!!", err);
  });
