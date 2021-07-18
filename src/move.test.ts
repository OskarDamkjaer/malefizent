import { access, createField, innerFindPaths, firstStepForColor } from "./game";
const f = createField();
const GOAL_POSITION = { x: 8, y: 14 };
const CORNER_START = { x: 0, y: 0 };

test("createField", () => {
  const g = access(f, GOAL_POSITION);
  expect(g.connectedTo.length).toEqual(1);
  expect(access(f, g.connectedTo[0]).contains).toEqual("BARRICADE");
});

test("innerFindPaths from start pos", () => {
  const y = access(f, CORNER_START);
  expect(innerFindPaths(f, y.position, [], 0, "YELLOW")).toEqual([
    { x: 0, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 1, "YELLOW")).toEqual([
    { x: 0, y: 1 },
    { x: 1, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 2, "YELLOW")).toEqual([
    { x: 0, y: 2 },
    { x: 2, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 3, "YELLOW")).toEqual([
    { x: 3, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 4, "YELLOW")).toEqual([
    { x: 4, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 5, "YELLOW")).toEqual([
    { x: 4, y: 1 },
    { x: 5, y: 0 },
  ]);
  expect(innerFindPaths(f, y.position, [], 6, "YELLOW")).toEqual([
    { x: 4, y: 2 },
    { x: 6, y: 0 },
  ]);
});

test("firstStepForColor", () => {
  expect(firstStepForColor(f, "RED")).toEqual({ x: 2, y: 0 });
  expect(firstStepForColor(f, "GREEN")).toEqual({ x: 6, y: 0 });
  expect(firstStepForColor(f, "YELLOW")).toEqual({ x: 10, y: 0 });
  expect(firstStepForColor(f, "BLUE")).toEqual({ x: 14, y: 0 });
});

test("innerFindPaths from empty board", () => {
  // Empty board
  expect(innerFindPaths(f, undefined, [], 1, "YELLOW")).toEqual([
    { x: 10, y: 0 },
  ]);
  expect(innerFindPaths(f, undefined, [], 5, "YELLOW")).toEqual([
    { x: 8, y: 2 },
    { x: 6, y: 0 },
    { x: 12, y: 2 },
    { x: 14, y: 0 },
  ]);
  expect(innerFindPaths(f, undefined, [], 6, "YELLOW")).toEqual([
    { x: 5, y: 0 },
    { x: 15, y: 0 },
  ]);
});
