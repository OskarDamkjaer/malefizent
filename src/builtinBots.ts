export const firstIsBestBot = {
  name: "FirstIsBestBot",
  author: "built-in",
  code: `function doTurn(data) {
  return data.moves[0];
}`,
};

export const randomBot = {
  name: "RandomBot",
  author: "built-in",
  code: `function doTurn(data) {
  const randomMove = data.moves[Math.floor(Math.random() * data.moves.length)]
  return randomMove;
}`,
};

export const playerStarter = {
  name: "CustomBotStarter",
  author: "you",
  code: `/* Below you'll find a function "doTurn" selecting a random move.  It's up to you to improve it. 
If your code does not return within ~200ms or selects an illegal move, one will be chosen at random instead.  */

function doTurn(boardState: {
  myPawns: Pawn[];
  otherPawns: Pawn[];
  allSpots: Spot[];
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  moves: Turn[];
}): Turn {
  //console.log(turnOptions[0])

  const randomMove = moves[Math.floor(Math.random() * moves.length)]
  return randomMove;
}

type Color = "BLUE" | "RED" | "YELLOW" | "GREEN";
type Position = { x: number; y: number }; 

type Pawn = {
  color: Color;
  number: number;
  position: Position | null;
};

type Spot = {
  contains: "OUTSIDE" | "NORMAL" | "BARRICADE" | "GOAL";
  startingPointColor?: Color;
  connectedTo: Position[];
  unBarricadeable?: boolean;
  goalDistance?: number;
  position: Position;
};

type Turn = {
  pawn: Pawn;
  spot: Spot;
  newBarricadePosition?: Position;
};
`,
};

export const killerBot = {
  name: "KillerBot",
  author: "built-in",
  code: `
function compare(p1,p2){
  if(!p1 || !p2){return false}
  
  return  p1.x === p2.x && p1.y === p2.y
}

function doTurn(possibleTurns) {
  const {moves, otherPawns} = possibleTurns

  const killMove = moves.find(m => 
    otherPawns.find(other => compare(m.spot.position, other))
   )

  if(killMove){
     return killMove
  }
  
  const randomMove = moves[Math.floor(Math.random() * moves.length)]
  return randomMove;
}
`,
};

export const postulateBot = {
  name: "PostulateBot",
  author: "built-in",
  code: `
function doTurn(possibleTurns) {
  const movesThatGoForward = turns.filter(turn => turn);
  return;
}
`,
};
export const pickableBots = [
  randomBot,
  killerBot,
  postulateBot,
  firstIsBestBot,
  playerStarter,
];
