import { access, createField } from "./game";
const field = createField();
const GOAL_POSITION = { x: 8, y: 14 };
const YELLOW_START = { x: 0, y: 0 };

test("createField", () => {
  const g = access(field, GOAL_POSITION);
  expect(g.connectedTo.length).toEqual(1);
  expect(access(field, g.connectedTo[0]).contains).toEqual("BARRICADE");
});

test("move", () => {
  const y = access(field, YELLOW_START);
  expect(y.connectedTo.length).toEqual(2);
});
