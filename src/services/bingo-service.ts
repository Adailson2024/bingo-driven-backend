import { Number } from "@prisma/client";

import { createNewBingoGame, getAllNumbersFromBingoGame, getBingoGameById, setNumberForBingoGame, updateBingoGameStatusToFinished } from "../repositories/bingo-repository";
import BINGORULES from "../config/bingo-rules";
import { badRequest, notFound } from "../errors";
import { generateRandomNumberNotUsed } from "../utils";

export async function getGame(gameId: number) {
  const includeNumbers = true;
  const game = await getBingoGameById(gameId, includeNumbers);

  if (!game) throw notFound(`Game with id ${gameId} not found.`);

  return game;
}

export async function createNewGame() {
  return await createNewBingoGame();
}

export async function generateNewNumber(gameId: number) {
  await getRunningBingoGame(gameId);

  const numbers = await fetchNumbers(gameId);
  const extractedValues = extractOnlyTheValues(numbers);
  let nextNumber = generateRandomNumberNotUsed(extractedValues, BINGORULES.min, BINGORULES.max);

  return await setNumberForBingoGame(gameId, nextNumber);
}

export async function finishGame(gameId: number) {
  await getRunningBingoGame(gameId);

  return await updateBingoGameStatusToFinished(gameId);
}

async function fetchNumbers(gameId: number) {
  const numbers = await getAllNumbersFromBingoGame(gameId);
  checkIfAllNumbersAlreadyBeenDrawn(numbers);

  return numbers;
}

function checkIfAllNumbersAlreadyBeenDrawn(numbers: Number[]) {
  const allNumbersAlreadyDrawed = numbers.length === BINGORULES.max;
  if (allNumbersAlreadyDrawed) {
    throw badRequest("All numbers have already been drawn.");
  }
}

async function getRunningBingoGame(gameId: number) {
  const game = await getBingoGameById(gameId);

  if (!game) throw notFound(`Game with id ${gameId} not found.`)
  if (game.finished) throw badRequest("You can't use a already finished game.");

  return game;
}

function extractOnlyTheValues(numbers: Number[]) {
  return numbers.map(({ value }) => value);
}