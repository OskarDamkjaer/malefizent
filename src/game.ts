type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
type Pawn = { color: Color };
export type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL" | "PAWN";

  currentPawn?: Pawn;
  startingPointColor?: Color;
  leadsTo: Spot[];
  comesFrom: Spot[];
  unBarricadeable?: boolean;
};

// TODO change data structure to make goal and empty implicit

type Position = { x: number; y: number };

// Börja med enkelt först
// TODO make iterable

const x = { contains: "OUTSIDE", leadsTo: [], comesFrom: [] };
const n = { contains: "NORMAL", leadsTo: [], comesFrom: [] };
const b = { contains: "BARRICADE", leadsTo: [], comesFrom: [] };
const g = { contains: "GOAL", leadsTo: [], comesFrom: [] };
const u = {
  contains: "NORMAL",
  unBarricadeable: true,
  leadsTo: [],
  comesFrom: [],
};
const p = {
  contains: "PAWN",
  currentPawn: { color: "BLUE" },
  leadsTo: [],
  comesFrom: [],
};
const R = {
  contains: "NORMAL",
  startingPointColor: "RED",
  leadsTo: [],
  comesFrom: [],
};
const G = {
  contains: "NORMAL",
  startingPointColor: "GREEN",
  leadsTo: [],
  comesFrom: [],
};
const Y = {
  contains: "NORMAL",
  startingPointColor: "YELLOW",
  leadsTo: [],
  comesFrom: [],
};
const B = {
  contains: "NORMAL",
  startingPointColor: "BLUE",
  leadsTo: [],
  comesFrom: [],
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

type Field = Spot[][];
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

function createField() {
  const startingPoint = { x: 7, y: 14 };
  const visited = [startingPoint];
  let curr;
  while ((curr = visited.pop())) {
    //const couldComeFrom = oneStepAway[k];
    //curr.comesFrom();
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

export function oneStepAway(f, p: Position) {
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
      return access(f, { x: p.x + dir.x, y: p.y + dir.y });
    })
    .filter((p) => p.contains !== "OUTSIDE");
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
