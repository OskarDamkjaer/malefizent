import type { Bot } from "./game";
// TODO stone stragety

export const RandomBot: Bot = {
  doMove: (turns) => turns[Math.floor(Math.random() * turns.length)],
};

export const FirstIsBestBot: Bot = {
  doMove: (turns) => turns[0],
};

/*
export const PosulateBot: Bot = {
  doMove: (turns) => {
    const movesThatGoForward = turns.filter(turn => turn.);
    return;
  },
};
*/
