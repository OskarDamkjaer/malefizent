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
function doTurn(turnOptions, myPawns, otherPawns, canHaveBarricade, allSpots) {
  const randomMove = turnOptions[Math.floor(Math.random() * turnOptions.length)]
  return randomMove;
}`;
export const playerStarterSource = `
/* Your job is to create a function called "doTurn" that takes 
the following parameters:
 turnOptions: Turn[];
 myPawns: Pawn[];
 otherPawns: Pawn[];
 canHavebarricade: Spot[];
 hasBarricade: Spot[];
 allSpots: Spot[]

 And you need to return one of the turnOptions. If turn chosen turn
 is invalid or your function took longer than 200ms to return, a random
 turn is chosen instead. see the types at bottom (TODO at side is better)

 You are blue.
 */ 

 function doTurn(turnOptions, myPawns, otherPawns, canHaveBarricade, allSpots) {
  //console.log(turnOptions[0])
  const randomMove = turnOptions[Math.floor(Math.random() * turnOptions.length)]

  const bestMove = turnOptions.slice().sort(
    (a, b) => b.spot.goalDistance - a.spot.goalDistance
   )[0];
  return bestMove;
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
