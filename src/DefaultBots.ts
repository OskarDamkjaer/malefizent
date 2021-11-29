import type { Bot } from "./game";
// TODO stone stragety
//TODO standaizre naming between move turns and so on

export const RandomBot: Bot = {
  doMove: (o) => o.moves[Math.floor(Math.random() * o.moves.length)],
};

export const FirstIsBestBot: Bot = {
  doMove: (opt) => opt.moves[0],
};

export const randomBotSource = `
function doTurn(data) {
  const randomMove = data.moves[Math.floor(Math.random() * data.moves.length)]
  return randomMove;
}`;
export const playerStarterSource = `
/* Your job is to create a function called "doTurn" that gets some data, 
see the TurnOptions type ref.

 And you need to return one of the moves. If turn chosen turn
 is invalid or your function took longer than 200ms to return, a random
 turn is chosen instead. see the types at bottom (TODO at side is better)

 You are blue.
 */ 

 function doTurn(possibleTurns) {
   const {moves} = possibleTurns
  //console.log(turnOptions[0])
  const randomMove = moves[Math.floor(Math.random() * moves.length)]

  const bestMove = moves.slice().sort(
    (a, b) => b.spot.goalDistance - a.spot.goalDistance
   )[0];
  return bestMove;
}
`;

export const killerBotSource = `
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
`;
/*
export const KillerBot: Bot = {
  doMove: (opts) => {
    const kill = opts.moves.find(m => m.spot.position)
  },
};
*/

/*
export const PosulateBot: Bot = {
  doMove: (turns) => {
    const movesThatGoForward = turns.filter(turn => turn.);
    return;
  },
};
*/
