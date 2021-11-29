import {
  GameState,
  Position,
  access,
  flatten,
  getNextTurnOptions,
  legalBarricadeSpots,
  pawnsNotFromPlayer,
  spotsWithBarricade,
  PossibleTurn,
} from "./game";
export { createGameState, doTurn } from "./game";

export function nextTurnOptions(state: GameState): PossibleTurn {
  const { player, options } = getNextTurnOptions(state);

  const myPawns = state.pawns[player];
  const otherPawns = pawnsNotFromPlayer(state, player);

  const hasBarricade = spotsWithBarricade(state);
  const canHavebarricade = legalBarricadeSpots(state).map((p) =>
    access(state, p)
  );

  return {
    myPawns,
    otherPawns,
    hasBarricade,
    canHavebarricade,
    moves: options,
    allSpots: state.field.reduce(flatten, []),
  };
}

export function spotAtPos(state: GameState, position: Position) {
  return access(state, position);
}
