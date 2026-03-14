import { Request, Response } from "express";
import httpStatus from "http-status";

import { getGame, createNewGame, finishGame, generateNewNumber } from "../services/bingo-service";
import { badRequest } from "../errors";

export async function getBingoGame(req: Request, res: Response) {
  const gameId = getValidGameIdFromRequest(req);
  const game = await getGame(gameId);

  return res.send(game);
}

export async function startNewBingoGame(req: Request, res: Response) {
  const game = await createNewGame();
  return res.status(httpStatus.CREATED).send(game);
}

export async function getNextNumberForBingoGame(req: Request, res: Response) {
  const gameId = getValidGameIdFromRequest(req);
  const number = await generateNewNumber(gameId);

  return res.send(number);
}

export async function finishBingoGame(req: Request, res: Response) {
  const gameId = getValidGameIdFromRequest(req);
  await finishGame(gameId);

  return res.sendStatus(httpStatus.NO_CONTENT);
}

function getValidGameIdFromRequest(req: Request) {
  const gameId = Number(req.params.id);
  if (isNaN(gameId) || gameId <= 0) {
    throw badRequest(`Game id ${req.params.id} is not valid`);
  }

  return gameId;
}