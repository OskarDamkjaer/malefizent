import {
  createSimpleField,
  access,
  oneStepAway,
  connectField,
  onePosAway,
} from "./game";
const field = createSimpleField();
const GOAL_POSITION = { x: 8, y: 14 };
const OUTSIDE_POSITION = { x: 8, y: 12 };

test("oneStepAway", () => {
  expect(oneStepAway(field, OUTSIDE_POSITION)).toEqual([]);
  expect(onePosAway(field, OUTSIDE_POSITION)).toEqual([]);

  expect(onePosAway(field, GOAL_POSITION)).toEqual([{ x: 8, y: 13 }]);
  expect(oneStepAway(field, GOAL_POSITION)).toEqual([
    {
      comesFrom: [],
      contains: "BARRICADE",
      leadsTo: [],
    },
  ]);

  expect(oneStepAway(field, { x: 8, y: 11 })).toEqual([
    {
      comesFrom: [],
      contains: "BARRICADE",
      leadsTo: [],
    },
    {
      comesFrom: [],
      contains: "NORMAL",
      leadsTo: [],
    },
    {
      comesFrom: [],
      contains: "NORMAL",
      leadsTo: [],
    },
  ]);
});

test("access", () => {
  expect(access(field, { x: 0, y: 0 })).toEqual({
    contains: "NORMAL",
    unBarricadeable: true,
    leadsTo: [],
    comesFrom: [],
  });

  expect(access(field, { x: 0, y: 2 })).toEqual({
    contains: "BARRICADE",
    leadsTo: [],
    comesFrom: [],
  });

  expect(access(field, GOAL_POSITION)).toEqual({
    contains: "GOAL",
    leadsTo: [],
    comesFrom: [],
  });

  expect(access(field, { x: 8, y: 13 })).toEqual({
    contains: "BARRICADE",
    leadsTo: [],
    comesFrom: [],
  });
});

test("createField", () => {
  connectField(field);
  const g = access(field, GOAL_POSITION);
  expect(g.leadsTo).toEqual([]);
  expect(g.comesFrom[0].contains).toEqual("BARRICADE");
  expect(g.comesFrom[0].comesFrom.length).toEqual(2);
});
