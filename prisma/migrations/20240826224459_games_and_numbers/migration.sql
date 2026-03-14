-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "numbers" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "numbers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "numbers" ADD CONSTRAINT "numbers_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
