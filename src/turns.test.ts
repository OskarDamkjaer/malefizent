import { createGameState, prepareTurn } from "./game";
const state = createGameState(1);

test("prepareTurn - first turn", () => {
  const firstTurn = prepareTurn(state);
  expect(firstTurn.player).toEqual("RED");
  expect(firstTurn.moves[1]).toEqual([{ x: 2, y: 0 }]);
  expect(firstTurn.moves[2]).toEqual([{ x: 2, y: 0 }]);
  expect(firstTurn.moves[3]).toEqual([{ x: 2, y: 0 }]);
  expect(firstTurn.moves[4]).toEqual([{ x: 2, y: 0 }]);
  expect(firstTurn.moves[5]).toEqual([{ x: 2, y: 0 }]);
});
