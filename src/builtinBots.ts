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
  code: `
/* Your job is to create a function called "doTurn" that a parameter of type PossibleTurn (see type ref) 
and one of its "moves". 

If turn chosen turn is invalid or your function took longer than 200ms to return, a random
 turn is chosen instead. 

You're blue. Dabadee dabedai.
 */ 

function doTurn(possibleTurns) {
  const {moves} = possibleTurns
  //console.log(turnOptions[0])

  const randomMove = moves[Math.floor(Math.random() * moves.length)]
  return randomMove;
}
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
  const movesThatGoForward = turns.filter(turn => turn.);
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
