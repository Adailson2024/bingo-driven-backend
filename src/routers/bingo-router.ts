import { Router } from "express";
import { getBingoGame, finishBingoGame, getNextNumberForBingoGame, startNewBingoGame } from "../controllers/bingo-controller";

const bingoRouter = Router();

bingoRouter.get("/games/:id", getBingoGame);
bingoRouter.post("/games/start", startNewBingoGame);
bingoRouter.patch("/games/number/:id", getNextNumberForBingoGame);
bingoRouter.patch("/games/finish/:id", finishBingoGame);

export default bingoRouter;