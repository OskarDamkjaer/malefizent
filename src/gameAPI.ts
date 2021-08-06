import {
  GameState,
  Pawn,
  Position,
  Spot,
  Turn,
  access,
  createGameState,
  doTurn,
  flatten,
  getNextTurnOptions,
  legalBarricadeSpots,
  pawnsNotFromPlayer,
  spotsWithBarricade,
} from "./game";

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

export class GameAPI {
  state: GameState = createGameState();

  nextTurnOptions(): PossibleTurn {
    const { player, options } = getNextTurnOptions(this.state);

    const myPawns = this.state.pawns[player];
    const otherPawns = pawnsNotFromPlayer(this.state, player);

    const hasBarricade = spotsWithBarricade(this.state);
    const canHavebarricade = legalBarricadeSpots(this.state).map((p) =>
      access(this.state, p)
    );

    return {
      myPawns,
      otherPawns,
      hasBarricade,
      canHavebarricade,
      moves: options,
      allSpots: this.state.field.reduce(flatten, []),
    };
  }

  doTurn(t: Turn): PossibleTurn {
    // TODO double check all input here
    // TODO use this in App.ts and for all the bots.
    // kommentera laglighet/vad som hände
    this.state = doTurn(this.state, t);
    // TODO deep copy or deep freeze?
    return this.nextTurnOptions();
  }

  spotAtPos(position: Position) {
    return access(this.state, position);
  }
}
