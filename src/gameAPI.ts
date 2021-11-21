import {
  GameState,
  Pawn,
  Position,
  Spot,
  Turn,
  access,
  flatten,
  getNextTurnOptions,
  legalBarricadeSpots,
  pawnsNotFromPlayer,
  spotsWithBarricade,
} from "./game";
export { createGameState, doTurn } from "./game";

// This class is only to hold the game state
// to make the UI code more ergonomic

type PossibleTurn = {
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  myPawns: Pawn[];
  otherPawns: Pawn[];
  allSpots: Spot[];
  moves: Turn[];
};
// Todo hade kunnat göra varje ruta så att den har en LEFT, RIGHT, FORWARD, BACK ist för leads to osv

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
