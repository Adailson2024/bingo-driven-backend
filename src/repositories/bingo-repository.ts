import prisma from "../database";

export async function createNewBingoGame() {
  return await prisma.game.create({});
}

export async function getBingoGameById(gameId: number, includeNumbers = false) {
  return await prisma.game.findUnique({
    where: {
      id: gameId
    },
    include: {
      numbers: includeNumbers
    }
  })
}

export async function setNumberForBingoGame(gameId: number, number: number) {
  return await prisma.number.create({
    data: {
      gameId,
      value: number
    }
  })
}

export async function updateBingoGameStatusToFinished(gameId: number) {
  return await prisma.game.update({
    where: {
      id: gameId
    },
    data: {
      finished: true
    }
  })
}

export async function getAllNumbersFromBingoGame(gameId: number) {
  return await prisma.number.findMany({
    where: {
      gameId
    }
  })
}