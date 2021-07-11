type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
type Pawn = { color: Color };
export type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL" | "PAWN";

  currentPawn?: Pawn;
  startingPointColor?: Color;
  connectedTo: Position[];
  unBarricadeable?: boolean;
};

// TODO change data structure to make goal and empty implicit

type Position = { x: number; y: number };

// Börja med enkelt först
// TODO make iterable

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

export function createSimpleField() {
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
  const undirected = malefitzField
    .split("\n")
    .slice(1)
    .reverse()
    .map((line) => line.split("").map((char) => charToObj[char]()));

  return undirected;
}

// spara alla vägar, undirected cyclic graph
// spara alla vägar

const pointToString = (p) => `${p.x}-${p.y}`;

export function connectField(f: Position[][]): void {
  const startingPoint = { x: 8, y: 14 };
  const visited: string[] = [pointToString(startingPoint)];
  const stack: Position[] = [startingPoint];
  let currPos: Position | undefined;

  // TODO gör denna mindre komplicerad. gå igenom varje med en for loop istället
  // TODO räkna steg från
  const goalDistance = {};
  const steps = 0;
  while ((currPos = stack.shift())) {
    const curr = access(f, currPos);
    const neighbourPos = onePosAway(f, currPos).filter(
      (p) => !visited.includes(pointToString(p))
    );

    curr.connectedTo.push(...neighbourPos);

    neighbourPos
      .map((n) => access(f, n))
      .forEach((spot) => {
        spot.connectedTo.push(currPos);
      });

    visited.push(pointToString(currPos));
    stack.push(...neighbourPos);
    goalDistance[pointToString(currPos)] = steps;
  }
}

export function access(field, { x, y }: Position): Spot | undefined {
  return (field[y] && field[y][x]) || { contains: "OUTSIDE" };
}

function availableMoves(roll: number, player: Color) {}

function comparePosition(p1: Position, p2: Position) {
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

function possibleMoves(spots: Spot[], distance: number): Spot[] {
  //const expandSpot = spot => moves.map(spot => )
  // return moves.map(({x,y}) => ).filter(p1 => visited.some(p2 => comparePosition(p1,p2))
  return [];
}

//export function getCurrentPlayingField(): Field {
//return playingField;
//}

let turn = 0;
const players: Color[] = ["RED", "GREEN", "YELLOW", "BLUE"];

function tick() {
  const player = players[turn % 4];
  turn += 1;
  const roll = Math.floor(Math.random() * 6);
  return [player, availableMoves(roll, player)];
}
