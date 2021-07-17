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
      position: { x: 8, y: 13 },
    },
  ]);

  expect(oneStepAway(field, { x: 8, y: 11 })).toEqual([
    {
      contains: "BARRICADE",
      connectedTo: [],
      position: { x: 8, y: 10 },
    },
    {
      contains: "NORMAL",
      connectedTo: [],
      position: { x: 7, y: 11 },
    },
    {
      contains: "NORMAL",
      connectedTo: [],
      position: { x: 9, y: 11 },
    },
  ]);
});

test("access", () => {
  expect(access(field, { x: 0, y: 0 })).toEqual({
    contains: "NORMAL",
    unBarricadeable: true,
    connectedTo: [],
    position: { x: 0, y: 0 },
  });

  expect(access(field, { x: 0, y: 2 }).contains).toEqual("BARRICADE");

  expect(access(field, GOAL_POSITION).contains).toEqual("GOAL");

  expect(access(field, { x: 8, y: 13 }).contains).toEqual("BARRICADE");
});

test("connectField", () => {
  connectField(field);
  const g = access(field, GOAL_POSITION);
  expect(g.connectedTo.length).toEqual(1);
  expect(access(field, g.connectedTo[0]).contains).toEqual("BARRICADE");
});
