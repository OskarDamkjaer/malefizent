import { access, createField, innerFindPaths } from "./game";
const f = createField();
const GOAL_POSITION = { x: 8, y: 14 };
const CORNER_START = { x: 0, y: 0 };

test("createField", () => {
  const g = access(f, GOAL_POSITION);
  expect(g.connectedTo.length).toEqual(1);
  expect(access(f, g.connectedTo[0]).contains).toEqual("BARRICADE");
});

test("innerFindPaths", () => {
  const y = access(f, CORNER_START);
  expect(innerFindPaths(f, y.position, [], 0)).toEqual([{ x: 0, y: 0 }]);
  expect(innerFindPaths(f, y.position, [], 1)).toEqual([
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 2)).toEqual([
    { x: 0, y: 2 },
    { x: 2, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 3)).toEqual([{ x: 3, y: 0 }]);
  expect(innerFindPaths(f, y.position, [], 4)).toEqual([{ x: 4, y: 0 }]);
  expect(innerFindPaths(f, y.position, [], 5)).toEqual([
    { x: 4, y: 1 },
    { x: 5, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 6)).toEqual([
    { x: 4, y: 2 },
    { x: 6, y: 0 },
  ]);
});
