// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import Logger from "./utils/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});