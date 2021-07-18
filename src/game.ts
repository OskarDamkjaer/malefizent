import { debug } from "svelte/internal";

type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
export type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL";
  startingPointColor?: Color;
  connectedTo: Position[];
  unBarricadeable?: boolean;
  goalDistance?: number;
  position: Position;
};

type Position = { x: number; y: number };

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
        b        
      nnnnn      
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
        .map((char, x) => ({ ...charToObj[char](), position: { x, y } }))
    );

  // 255 in total
  // 114 spots inside
  // 142 outside

  return undirected;
}

const pointToString = (p) => `${p.x}-${p.y}`;

export function connectField(f: Spot[][]): void {
  const startingPoint = { x: 8, y: 14 };
  const visited: string[] = [];
  const stack: Position[] = [startingPoint];
  let currPos: Position | undefined;

  while ((currPos = stack.shift())) {
    const currSpot = access(f, currPos);

    const neighbourPos = onePosAway(f, currPos).filter(
      (p) => !visited.includes(pointToString(p))
    );

    // korsningar besöks två gånger
    if (!visited.includes(pointToString(currPos))) {
      neighbourPos
        .map((n) => access(f, n))
        .forEach((spot) => {
          spot.goalDistance = (currSpot.goalDistance || 0) + 1;
        });

      visited.push(pointToString(currPos));
      stack.push(...neighbourPos);
    }
  }

  f.forEach((row) =>
    row.forEach((spot) => {
      if (spot.contains !== "OUTSIDE") {
        if (spot.connectedTo.length === 0) {
          // I cannot fathom why this length check would ever be needed.
          spot.connectedTo.push(...onePosAway(f, spot.position));
        }
      }
    })
  );
}

export function access(field, { x, y }: Position): Spot | undefined {
  return (field[y] && field[y][x]) || { contains: "OUTSIDE" };
}

function isSamePosition(p1: Position, p2: Position) {
  if (!p1) {
    return false;
  }

  return p1.x === p2.x && p1.y === p2.y;
}

const moves: Move[] = ["UP", "DOWN", "LEFT", "RIGHT"];
type Move = "UP" | "DOWN" | "LEFT" | "RIGHT";

export function onePosAway(f, p: Position): Position[] {
  if (access(f, p).contains === "OUTSIDE") return [];

  const directions = {
    UP: { x: 0, y: 1 },
    DOWN: { x: 0, y: -1 },
    RIGHT: { x: 1, y: 0 },
    LEFT: { x: -1, y: 0 },
  };

  return moves
    .map((move) => {
      const dir = directions[move];
      return { x: p.x + dir.x, y: p.y + dir.y };
    })
    .filter((p) => access(f, p).contains !== "OUTSIDE");
}

export function oneStepAway(f, p: Position): Spot[] {
  return onePosAway(f, p).map((p1) => access(f, p1));
}

function flatten<T>(acc: T[], curr: T[]): T[] {
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
    (p) => !visited.find((v) => v.x === p.x && v.y === p.y)
  );
  const cantPass = notVisited.filter((p) => {
    const isBarricade = access(f, p).contains === "BARRICADE";
    const lastStep = stepsLeft === 1;
    return !isBarricade || lastStep;
  });
  const cantStopOnSelf = cantPass.filter((p) => {
    const isSelf = posContainsPawn(state, p)?.color === currColor;
    const lastStep = stepsLeft === 1;
    return !(isSelf && lastStep);
  });

  return cantStopOnSelf
    .map((p) => innerFindPaths(state, p, visited, stepsLeft - 1, currColor))
    .reduce(flatten, []);
}

export function firstStepForColor(f: Spot[][], color: Color): Position {
  return f
    .reduce(flatten, [])
    .find((spot) => spot.startingPointColor === color)!.position;
}

function roll() {
  return Math.floor(Math.random() * 6);
}

const players: Color[] = ["RED", "GREEN", "YELLOW", "BLUE"];
type Pawn = {
  color: Color;
  number: number;
  position: Position | null; // if not on board is missing
  name?: string; // for later
};
const createFivePawns = (color: Color) =>
  Array.from({ length: 6 }, (_, i) => ({
    number: i + 1,
    color,
    position: null,
  }));

type Pawns = Record<Color, Pawn[]>;
type GameState = {
  field: Spot[][];
  turn: number;
  pawns: Pawns;
  diceRoll: number;
  winner?: Color;
};
type MoveOptions = { player: Color; moves: Record<number, Position[]> };

export function prepareTurn(state: GameState): MoveOptions {
  const { turn, pawns, diceRoll } = state;
  const player = currentPlayer(turn);

  const moves = pawns[player]
    .map((pawn) => ({
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
        moves: [],
      }
    );

  return moves;
}
function posContainsPawn(state: GameState, pos: Position): Pawn | null {
  const allPawns = Object.values(state.pawns).reduce(flatten, []);

  return allPawns.find((pawn) => isSamePosition(pawn.position, pos)) || null;
}

type ChosenTurn = {
  pawnNumber: number;
  move: Position;
  newBarricadePosition?: Position;
};

export function doTurn(state: GameState, chosenTurn: ChosenTurn): GameState {
  const { field, turn, pawns, winner } = state;
  if (winner) {
    return state;
  }

  const player = currentPlayer(state.turn);

  const legalTurns = prepareTurn(state);
  const isLegalMove = legalTurns.moves[chosenTurn.pawnNumber].some((pos) =>
    isSamePosition(chosenTurn.move, pos)
  );
  if (!isLegalMove) {
    // skip turn
    return { field, pawns, turn: turn + 1, diceRoll: roll() };
  }

  const chosenSpot = access(field, chosenTurn.move);
  const won = chosenSpot.contains === "GOAL";

  const hitPawn = posContainsPawn(state, chosenTurn.move);
  const afterFirstMove = movePawn(
    pawns,
    player,
    chosenTurn.pawnNumber,
    chosenTurn.move
  );
  const newPawns = hitPawn
    ? movePawn(afterFirstMove, hitPawn.color, hitPawn.number, null)
    : afterFirstMove;

  const shouldMoveBarricade = chosenSpot.contains === "BARRICADE";
  const newField = shouldMoveBarricade
    ? moveBarricade(state, chosenTurn.move, chosenTurn.newBarricadePosition)
    : field;

  // if barricade was moved and new barricade pos was missing. randomize

  return {
    field: newField,
    turn: turn + 1,
    pawns: newPawns,
    diceRoll: roll(),
    winner: won ? player : undefined,
  };
}

export function legalBarricadeSpots(state: GameState): Position[] {
  return state.field
    .reduce(flatten, [])
    .filter((spot) => spot.contains === "NORMAL")
    .filter((spot) => !spot.unBarricadeable)
    .filter((spot) => !posContainsPawn(state, spot.position))
    .map((spot) => spot.position);
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
    to && legalBarrSpots.some((spot) => isSamePosition(spot, to));

  // if illegal spot randomize
  const newBarPosition: Position = choseLegalSpot
    ? to
    : legalBarrSpots[Math.floor(Math.random() * legalBarrSpots.length)];
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
  const copy = f.map((row) => [...row]);

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
  to: Position
): Pawns {
  const currPawn = pawns[color][pawnNumber];

  return {
    ...pawns,
    [color]: { ...pawns[color], [pawnNumber]: { ...currPawn, position: to } },
  };
}

export function createField(): Spot[][] {
  const field = createSimpleField();
  connectField(field);
  return field;
}

function currentPlayer(turn: number): Color {
  return players[turn % 4];
}

export function createGameState(seed?: number): GameState {
  return {
    field: createField(),
    turn: 0,
    diceRoll: seed === undefined ? roll() : seed,
    pawns: players.reduce(
      (acc, curr) => ({ ...acc, [curr]: createFivePawns(curr) }),
      {}
    ) as Record<Color, Pawn[]>,
  };
}
