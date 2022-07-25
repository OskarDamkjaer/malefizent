const types = `
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
  unBarricadeable: boolean;
  goalDistance: number;
  position: Position;
};

type Turn = {
  pawn: Pawn;
  newSpot: Spot;
  oldSpot: Spot;
  newBarricadePosition?: Position;
 };

 type GameState = {
   myPawns: Pawn[];
   otherPawns: Pawn[];
   allSpots: Spot[];
   canHavebarricade: Spot[];
   hasBarricade: Spot[];
   moves: Turn[]
 }
`;
export const firstIsBestBot = {
  name: "FirstIsBestBot",
  author: "built-in",
  code: `function doTurn(data: GameState): Turn {
  return data.moves[0];
}
${types}`,
};

export const randomBot = {
  name: "RandomBot",
  author: "built-in",
  code: `function doTurn(data: GameState): Turn {
  const randomMove = data.moves[Math.floor(Math.random() * data.moves.length)]
  return randomMove;
}
${types}`,
};

export const playerStarter = {
  name: "CustomBotStarter",
  author: "you",
  code: `/* 
Below you'll find a function "doTurn" selecting a random move.  
It's up to you to improve it. 

If your code does not return within ~200ms (not yet implemented)
 or selects an illegal move one will be chosen at random. 
*/

function doTurn(boardState: {
  myPawns: Pawn[];
  otherPawns: Pawn[];
  allSpots: Spot[];
  canHavebarricade: Spot[];
  hasBarricade: Spot[];
  moves: Turn[];
}): Turn {
  const {moves} = boardState
  console.log(moves[0])

  const randomMove = moves[Math.floor(Math.random() * moves.length)]
  return randomMove
}
${types}
`,
};

export const killerBot = {
  name: "KillerBot",
  author: "built-in",
  code: `function doTurn(data: GameState): Turn {
  const { moves, otherPawns } = data;

  const takenPositions = new Set(
    otherPawns
      .filter(p => p.position)
      .map(p => p.position!.x + ":" + p.position!.y)
  );

  const killMove = moves.find(m =>
    takenPositions.has(m.newSpot.position!.x + ":" + m.newSpot.position!.y)
  );

  if (killMove) {
    return killMove;
  }

  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  return randomMove;
}
${types}
`,
};

export const basicBot = {
  name: "BasicBot",
  author: "built-in",
  code: `
function doTurn({moves}: GameState): Turn {
  const winningMove = moves.find(move => move.newSpot.contains === "GOAL")
  if(winningMove) {
    return winningMove
  }

  const movesThatGoForward = moves
    .filter(turn => turn.oldSpot.goalDistance > turn.newSpot.goalDistance)
    .sort((t1, t2) => t1.newSpot.goalDistance - t2.newSpot.goalDistance)
    
  return movesThatGoForward[0];
}
${types}
`,
};
export const pickableBots = [randomBot, killerBot, basicBot, firstIsBestBot];
