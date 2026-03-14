import express, { json, Request, Response } from "express";
import "express-async-errors";
import dotenv from "dotenv";
import httpStatus from "http-status";
import cors from "cors";

import errorHandlerMiddleware from "./middlewares/error-middleware";
import bingoRouter from "./routers/bingo-router";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.get("/health", (req: Request, res: Response) => res.status(httpStatus.OK).send(`I'm okay!`));

app.use(bingoRouter);
app.use(errorHandlerMiddleware);

export default app;