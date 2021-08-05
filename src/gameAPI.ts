import {
  GameState,
  Position,
  Spot,
  Turn,
  access,
  createGameState,
  doTurn,
  getNextTurnOptions,
  legalBarricadeSpots,
  pawnsNotFromPlayer,
  posContainsPawn,
  spotsWithBarricade,
  Pawn,
} from "./game";

// This class is only to hold the game state
// to make the UI code more ergonomic

type PossibleTurn = {
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  myPawns: Pawn[];
  otherPawns: Pawn[];
  fullField: Spot[][];
  moves: Turn[];
};

export class Game {
  state: GameState = createGameState();

  doTurn(t: Turn): PossibleTurn {
    // TODO double check all input here
    this.state = doTurn(this.state, t);
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
      fullField: this.state.field,
    };
    // TODO copy
  }

  spotAtPos(position: Position) {
    return access(this.state, position);
  }
}
