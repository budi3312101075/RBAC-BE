import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { IUserModel } from "./models/userModel";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserModel;
    }
  }
}

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
