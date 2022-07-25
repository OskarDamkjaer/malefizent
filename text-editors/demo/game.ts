export type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
export type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL";
  startingPointColor?: Color;
  connectedTo: Position[];
  unBarricadeable: boolean;
  goalDistance: number;
  position: Position;
};

export type Position = { x: number; y: number };
type Move = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Pawn = {
  color: Color;
  number: number;
  position: Position | null; // if not on board is missing
  name?: string; // for later
};
type Pawns = Record<Color, Pawn[]>;

export type GameState = {
  // Should probably hold barricades as well
  field: Spot[][];
  turn: number;
  pawns: Pawns;
  diceRoll: number;
  players: Color[];
  winner?: Color;
};
type MoveOptions = { player: Color; moves: Record<number, Position[]> };
export type TurnOptions = {
  player: Color;
  options: Turn[];
};
export type PossibleTurn = {
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  myPawns: Pawn[];
  otherPawns: Pawn[];
  allSpots: Spot[];
  moves: Turn[];
};

export type Bot = { doMove: (options: PossibleTurn) => Turn };
export type BotSet = [Bot, Bot, Bot, Bot];

export type Turn = {
  pawn: Pawn;
  newSpot: Spot;
  oldSpot: Spot;
  newBarricadePosition?: Position;
};

const x = { contains: "OUTSIDE", connectedTo: [] };
const n = { contains: "NORMAL", connectedTo: [] };
const b = { contains: "BARRICADE", connectedTo: [] };
const g = { contains: "GOAL", connectedTo: [] };
const u = {
  contains: "NORMAL",
  unBarricadeable: true,
  connectedTo: [],
};
const p = {
  contains: "PAWN",
  currentPawn: { color: "BLUE" },
  connectedTo: [],
};
const R = {
  contains: "NORMAL",
  startingPointColor: "RED",
  connectedTo: [],
};
const G = {
  contains: "NORMAL",
  startingPointColor: "GREEN",
  connectedTo: [],
  goalDistance: 0,
};
const Y = {
  contains: "NORMAL",
  startingPointColor: "YELLOW",
  connectedTo: [],
};
const B = {
  contains: "NORMAL",
  startingPointColor: "BLUE",
  connectedTo: [],
};

const charToObj = {
  p: () => ({ ...p }),
  g: () => ({ ...g }),
  b: () => ({ ...b }),
  n: () => ({ ...n }),
  u: () => ({ ...u }),
  R: () => ({ ...R }),
  G: () => ({ ...G }),
  Y: () => ({ ...Y }),
  B: () => ({ ...B }),
  " ": () => ({ ...x }),
};

export function createSimpleField(): Spot[][] {
  const malefitzField = `
        g        
nnnnnnnnbnnnnnnnn
n               n
nnnnnnnnbnnnnnnnn
        b        
      nnbnn      
      n   n      
    nnbnnnbnn    
    n       n    
  nnnnnnnnnnnnn  
  n   n   n   n  
bnnnbnnnbnnnbnnnb
u   u   u   u   u
uuRuuuGuuuYuuuBuu`;

  //  ^ y+
  //  |
  //  |
  //  |
  //  0------> x+
  const undirected: Spot[][] = malefitzField
    .split("\n")
    .slice(1)
    .reverse()
    .map((line, y) =>
      line
        .split("")
        // @ts-ignore
        .map((char, x) => ({ ...charToObj[char](), position: { x, y } }))
    );

  return undirected;
}

const pointToString = (p: Position) => `${p.x}-${p.y}`;

export function connectField(f: Spot[][]): void {
  const startingPoint = { x: 8, y: 13 };
  const visited: string[] = [];
  const stack: Position[] = [startingPoint];
  let currPos: Position | undefined;

  while ((currPos = stack.shift())) {
    const currSpot = access(f, currPos);

    const neighbourPos = onePosAway(f, currPos).filter(
      p => !visited.includes(pointToString(p))
    );

    // korsningar besöks två gånger
    if (!visited.includes(pointToString(currPos))) {
      neighbourPos
        .map(n => access(f, n))
        .filter((s): s is Spot => s !== undefined)
        .forEach(spot => {
          if (currSpot) {
            spot.goalDistance = (currSpot.goalDistance || 0) + 1;
          }
        });

      visited.push(pointToString(currPos));
      stack.push(...neighbourPos);
    }
  }

  f.forEach(row =>
    row.forEach(spot => {
      if (spot.contains !== "OUTSIDE") {
        if (spot.connectedTo.length === 0) {
          // I cannot fathom why this length check would ever be needed.
          spot.connectedTo.push(...onePosAway(f, spot.position));
        }
      }
    })
  );
}

export function access(field: Spot[][], pos: Position): Spot {
  const outSide: Spot = {
    contains: "OUTSIDE",
    position: { x: 3324, y: -342 },
    connectedTo: [],
    unBarricadeable: true,
    goalDistance: 9999,
  };
  if (!pos) return outSide;

  const { x, y } = pos;
  return (field[y] && field[y][x]) ?? outSide;
}

function isSamePosition(p1: Position | null, p2: Position | null) {
  if (p1 === null && p2 === null) {
    return true;
  }

  if (!p1 || !p2) {
    return false;
  }

  return p1.x === p2.x && p1.y === p2.y;
}

const moves: Move[] = ["UP", "DOWN", "LEFT", "RIGHT"];

export function onePosAway(f: Spot[][], p: Position): Position[] {
  if (access(f, p).contains === "OUTSIDE") return [];

  const directions = {
    UP: { x: 0, y: 1 },
    DOWN: { x: 0, y: -1 },
    RIGHT: { x: 1, y: 0 },
    LEFT: { x: -1, y: 0 },
  };

  return moves
    .map(move => {
      const dir = directions[move];
      return { x: p.x + dir.x, y: p.y + dir.y };
    })
    .filter(p => access(f, p).contains !== "OUTSIDE");
}

export function oneStepAway(f: Spot[][], p: Position): Spot[] {
  return onePosAway(f, p).map(p1 => access(f, p1));
}

export function flatten<T>(acc: T[], curr: T[]): T[] {
  return acc.concat(curr);
}

export function innerFindPaths(
  state: GameState,
  curr: Position | null,
  baseVisited: Position[],
  stepsLeft: number,
  currColor: Color
): Position[] {
  const { field: f } = state;
  if (stepsLeft === 0) {
    if (!curr) {
      throw new Error("can't leave base on 0 steps");
    }
    return [curr];
  }

  const visited = curr ? [...baseVisited, curr] : baseVisited;

  // if no position yet only step possible first step is move out
  const all = curr ? onePosAway(f, curr) : [firstStepForColor(f, currColor)];

  const notVisited = all.filter(
    p => !visited.find(v => v.x === p.x && v.y === p.y)
  );
  const cantPass = notVisited.filter(p => {
    const isBarricade = access(f, p).contains === "BARRICADE";
    const lastStep = stepsLeft === 1;
    return !isBarricade || lastStep;
  });
  const cantStopOnSelf = cantPass.filter(p => {
    const isSelf = posContainsPawn(state, p)?.color === currColor;
    const lastStep = stepsLeft === 1;
    return !(isSelf && lastStep);
  });

  return cantStopOnSelf
    .map(p => innerFindPaths(state, p, visited, stepsLeft - 1, currColor))
    .reduce(flatten, []);
}

export function firstStepForColor(f: Spot[][], color: Color): Position {
  return f.reduce(flatten, []).find(spot => spot.startingPointColor === color)!
    .position;
}

function roll() {
  return Math.floor(Math.random() * 6) + 1;
}

const createFivePawns = (color: Color) =>
  Array.from({ length: 5 }, (_, i) => ({
    number: i + 1,
    color,
    position: null,
  }));

export function prepareTurn(state: GameState): MoveOptions {
  const { pawns, diceRoll } = state;
  const player = currentPlayer(state);

  const moves = pawns[player]
    .map(pawn => ({
      pawnNumber: pawn.number,
      moves: innerFindPaths(state, pawn.position, [], diceRoll, player),
    }))
    .reduce(
      (acc, curr) => ({
        ...acc,
        moves: { ...acc.moves, [curr.pawnNumber]: curr.moves },
      }),
      {
        player,
        moves: {},
      }
    );

  return moves;
}

export function getNextTurnOptions(state: GameState): TurnOptions {
  const { pawns, diceRoll } = state;
  const player = currentPlayer(state);

  const options = pawns[player]
    .map(pawn =>
      innerFindPaths(state, pawn.position, [], diceRoll, player).map(pos => ({
        pawn,
        newSpot: access(state.field, pos),
        oldSpot: access(state.field, pawn.position),
      }))
    )
    .reduce(flatten, []);

  return { player, options };
}

export function posContainsPawn(state: GameState, pos: Position): Pawn | null {
  const allPawns = Object.values(state.pawns).reduce(flatten, []);

  return (
    allPawns.find(pawn =>
      isSamePosition(pawn.position ?? { x: -999, y: -999 }, pos)
    ) || null
  );
}

function randomInList<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function isSamePawn(p1: Pawn, p2: Pawn): boolean {
  return (
    p1.color === p2.color &&
    p1.name === p2.name &&
    p1.number === p2.number &&
    isSamePosition(p1.position, p2.position)
  );
}

const isTurnish = (a: unknown): a is Turn =>
  a && typeof a === "object" && "pawn" in a && "newSpot" in a && "oldSpot" in a;

export function doTurn(state: GameState, chosenTurn: unknown): GameState {
  const { field, turn, pawns, winner } = state;
  if (winner) {
    return state;
  }

  const player = currentPlayer(state);
  const legalTurns = getNextTurnOptions(state);
  if (legalTurns.options.length === 0) {
    console.log("no legal turns available, skipping");
    return {
      ...state,
      turn: turn + 1,
      diceRoll: roll(),
    };
  }
  let actualMove = randomInList(legalTurns.options);

  if (!isTurnish(chosenTurn)) {
    console.log("Illegal turn: expected valid turn, got:" + chosenTurn);
  } else if (player !== chosenTurn.pawn.color) {
    console.log(
      "Illegal turn: it's " +
        player +
        "s turn, but got move for " +
        chosenTurn.pawn.color
    );
  } else {
    const isCorrectPlacement = legalTurns.options.some(
      ({ pawn, newSpot }) =>
        isSamePawn(pawn, chosenTurn.pawn) &&
        isSamePosition(chosenTurn.newSpot.position, newSpot.position)
    );

    if (isCorrectPlacement) {
      actualMove = chosenTurn;
    } else {
      console.log("illegal move placement");
    }
  }

  if (!actualMove) {
    debugger;
  }
  const won = actualMove.newSpot.contains === "GOAL";

  const hitPawn = posContainsPawn(state, actualMove.newSpot.position);
  const afterFirstMove = movePawn(
    pawns,
    player,
    actualMove.pawn.number,
    actualMove.newSpot.position
  );

  const newPawns = hitPawn
    ? movePawn(afterFirstMove, hitPawn.color, hitPawn.number, null)
    : afterFirstMove;

  const shouldMoveBarricade = actualMove.newSpot.contains === "BARRICADE";
  const newField = shouldMoveBarricade
    ? moveBarricade(
        state,
        actualMove.newSpot.position,
        actualMove.newBarricadePosition
      )
    : field;

  // if barricade was moved and new barricade pos was missing. randomize

  return {
    field: newField,
    turn: turn + 1,
    pawns: newPawns,
    diceRoll: roll(),
    players: state.players,
    winner: won ? player : undefined,
  };
}

export function legalBarricadeSpots(state: GameState): Position[] {
  return state.field
    .reduce(flatten, [])
    .filter(spot => spot.contains === "NORMAL")
    .filter(spot => !spot.unBarricadeable)
    .filter(spot => !posContainsPawn(state, spot.position))
    .map(spot => spot.position);
}

export function spotsWithBarricade(state: GameState): Spot[] {
  return state.field
    .reduce(flatten, [])
    .filter(spot => spot.contains === "BARRICADE");
}

export function nonEmptySpots(state: GameState): Spot[] {
  return state.field
    .reduce(flatten, [])
    .filter(
      spot =>
        spot.contains === "BARRICADE" ||
        spot.contains === "GOAL" ||
        posContainsPawn(state, spot.position)
    );
}

function moveBarricade(
  state: GameState,
  from: Position,
  to?: Position
): Spot[][] {
  const { field: f } = state;
  const oldBarrSpot = access(f, from);
  const emptyBarricade: Spot = { ...oldBarrSpot, contains: "NORMAL" };

  const legalBarrSpots = legalBarricadeSpots(state);
  const choseLegalSpot =
    to && legalBarrSpots.some(spot => isSamePosition(spot, to));

  // if illegal spot randomize
  const newBarPosition: Position =
    to && choseLegalSpot ? to : randomInList(legalBarrSpots);
  const newBarSpot = access(f, newBarPosition);
  const barricaded: Spot = { ...newBarSpot, contains: "BARRICADE" };

  return updateFieldSpots(f, [
    { pos: from, newSpot: emptyBarricade },
    { pos: newBarPosition, newSpot: barricaded },
  ]);
}

function updateFieldSpots(
  f: Spot[][],
  updates: {
    pos: Position;
    newSpot: Spot;
  }[]
): Spot[][] {
  const copy = f.map(row => [...row]);

  updates.forEach(({ pos, newSpot }) => {
    const { x, y } = pos;
    copy[y][x] = newSpot;
  });

  return copy;
}

function movePawn(
  pawns: Pawns,
  color: Color,
  pawnNumber: number,
  to: Position | null
): Pawns {
  const currPawn = pawns[color][pawnNumber - 1];
  const copiedPawns = pawns[color].slice();

  copiedPawns[pawnNumber - 1] = { ...currPawn, position: to };

  return { ...pawns, [color]: copiedPawns };
}

export function createField(): Spot[][] {
  const field = createSimpleField();
  connectField(field);
  return field;
}

export function currentPlayer(state: GameState): Color {
  return state.players[state.turn % 4];
}

export function createGameState(seed?: number): GameState {
  const colors: Color[] = ["RED", "GREEN", "YELLOW", "BLUE"];

  const players = colors
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return {
    field: createField(),
    turn: 0,
    players,
    diceRoll: seed === undefined ? roll() : seed,
    pawns: players.reduce(
      (acc, curr) => ({ ...acc, [curr]: createFivePawns(curr) }),
      {}
    ) as Record<Color, Pawn[]>,
  };
}

export function pawnsNotFromPlayer(state: GameState, player: Color): Pawn[] {
  return Object.entries(state.pawns)
    .filter(([color]) => color !== player)
    .map(([_color, pawns]) => pawns)
    .reduce(flatten, []);
}
