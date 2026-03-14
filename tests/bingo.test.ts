import supertest from "supertest";
import app from "../src/app";
import prisma from "../src/database";
import { generateFullGame, generateNewGame } from "./factories/bingo-factory";
import httpStatus from "http-status";

const api = supertest(app);

beforeEach(async () => {
  await prisma.number.deleteMany();
  await prisma.game.deleteMany();
});

describe("GET /games", () => {
  it("should get game by id", async () => {
    const { id } = await generateNewGame();
    const { status, body } = await api.get(`/games/${id}`);
    expect(status).toBe(httpStatus.OK);
    expect(body).toEqual({
      id,
      finished: false,
      date: expect.any(String),
      numbers: []
    });
  });

  it("should return 404 if game not found", async () => {
    const { status, body } = await api.get(`/games/1`);
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 400 if id is not valid", async () => {
    const { status, body } = await api.get(`/games/idNotValid`);
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

});

describe("POST /games/start", () => {
  it("should create a new game", async () => {
    const { status, body } = await api.post("/games/start");
    expect(status).toBe(httpStatus.CREATED);
    expect(body).toEqual({
      id: expect.any(Number),
      finished: false,
      date: expect.any(String)
    })
  });

  describe("PATCH /games/finish", () => {
    it("should finish a game", async () => {
      const { id } = await generateNewGame();
      const { status } = await api.patch(`/games/finish/${id}`);
      expect(status).toBe(httpStatus.NO_CONTENT);

      const game = await prisma.game.findUnique({
        where: { id }
      });
      expect(game.finished).toBe(true);
    });

    it("should return 404 if game is not found", async () => {
      const { status } = await api.patch(`/games/finish/1`);
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 400 if game is already finished", async () => {
      const id = await generateNewGame(true);

      const { status } = await api.patch(`/games/finish/${id}`);
      expect(status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  describe("PATCH /games/number", () => {
    it("should generate a new number for a game", async () => {
      const { id } = await generateNewGame();
      const { status, body } = await api.patch(`/games/number/${id}`);
      expect(status).toBe(httpStatus.OK);
      expect(body).toEqual({
        id: expect.any(Number),
        value: expect.any(Number),
        gameId: id
      });

      const number = await prisma.number.findUnique({
        where: { id: body.id }
      });

      expect(number).not.toBe(null);
    });

    it("should return 404 if game is not found", async () => {
      const { status } = await api.patch(`/games/number/1`);
      expect(status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 400 if game is already finished", async () => {
      const id = await generateNewGame(true);

      const { status } = await api.patch(`/games/number/${id}`);
      expect(status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 400 if game already has all numbers", async () => {
      const { id } = await generateFullGame();

      const { status } = await api.patch(`/games/number/${id}`);
      expect(status).toBe(httpStatus.BAD_REQUEST);
    });




  });


});