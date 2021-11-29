import type { Bot } from "./game";
// TODO stone stragety
//TODO standaizre naming between move turns and so on

export const RandomBot: Bot = {
  doMove: (o) => o.moves[Math.floor(Math.random() * o.moves.length)],
};

export const FirstIsBestBot: Bot = {
  doMove: (opt) => opt.moves[0],
};

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
