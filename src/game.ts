import { debug } from "svelte/internal";

type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
type Pawn = { color: Color };
export type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL" | "PAWN";
  currentPawn?: Pawn;
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
  // vi håller bara koll på vilka man har vart på
  return [];
}

let turn = 0;
const players: Color[] = ["RED", "GREEN", "YELLOW", "BLUE"];

function tick() {
  const player = players[turn % 4];
  turn += 1;
  const roll = Math.floor(Math.random() * 6);
  return [player, availableMoves(roll, player)];
}

export function createField(): Spot[][] {
  const field = createSimpleField();
  connectField(field);
  return field;
}

// TODO visa vilka connected to.
// TODO testa moves
