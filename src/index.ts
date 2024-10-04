import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { IUserModel } from "./models/userModel";
import { runSeederUsers } from "./database/seeders";
import cors from "cors";

declare global {
  namespace Express {
    export interface Request {
      user?: IUserModel;
    }
  }
}

const app = express();

dotenv.config();

app.use(cors({ origin: process.env.CORS, credentials: true }));
app.use(express.json());
app.use(cookieParser());

runSeederUsers();

app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(
    `⚡️[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
