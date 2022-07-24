import { createGameState, prepareTurn, access, doTurn } from "../text-editors/game";
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

test("do Turn - first turn", () => {
  const state = createGameState(5);
  expect(prepareTurn(state).moves[1]).toEqual([
    { x: 0, y: 2 },
    { x: 4, y: 2 },
    { x: 6, y: 0 },
  ]);
  const barricades = state.field
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((p) => p.contains === "BARRICADE");
  expect(barricades.length === 11);
  // no barricade
  expect(
    barricades.find((p) => p.position.x === 5 && p.position.y === 2)
  ).toEqual(undefined);

  expect(state.turn === 0);
  const newState = doTurn(state, {
    pawnNumber: 1,
    spot: access(state.field, { x: 4, y: 2 }),
    newBarricadePosition: { x: 5, y: 2 },
  });
  expect(newState.turn === 1);
  const newBarricades = newState.field
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((p) => p.contains === "BARRICADE");

  // moved barricade
  expect(newBarricades.length === 11);
  expect(
    newBarricades.find((p) => p.position.x === 5 && p.position.y === 2)
  ).toEqual({
    connectedTo: [
      { x: 0, y: 2 },
      { x: 2, y: 2 },
    ],
    contains: "BARRICADE",
    goalDistance: 35,
    position: { x: 5, y: 2 },
  });
});
