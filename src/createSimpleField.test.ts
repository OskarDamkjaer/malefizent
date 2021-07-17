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
      contains: "BARRICADE",
      connectedTo: [],
    },
  ]);

  expect(oneStepAway(field, { x: 8, y: 11 })).toEqual([
    {
      connectedTo: [],
      contains: "BARRICADE",
    },
    {
      connectedTo: [],
      contains: "NORMAL",
    },
    {
      connectedTo: [],
      contains: "NORMAL",
    },
  ]);
});

test("access", () => {
  expect(access(field, { x: 0, y: 0 })).toEqual({
    contains: "NORMAL",
    unBarricadeable: true,
    connectedTo: [],
  });

  expect(access(field, { x: 0, y: 2 })).toEqual({
    contains: "BARRICADE",
    connectedTo: [],
  });

  expect(access(field, GOAL_POSITION)).toEqual({
    contains: "GOAL",
    connectedTo: [],
  });

  expect(access(field, { x: 8, y: 13 })).toEqual({
    contains: "BARRICADE",
    connectedTo: [],
  });
});

test("connectField", () => {
  connectField(field);
  const g = access(field, GOAL_POSITION);
  expect(g.connectedTo.length).toEqual(1);
  expect(access(field, g.connectedTo[0]).contains).toEqual("BARRICADE");
});
