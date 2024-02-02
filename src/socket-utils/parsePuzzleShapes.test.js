import { parsePuzzleShapes, SAMPLE } from "./parsePuzzleShapes";

test("parsePuzzleShapes function Test", () => {
  const result = parsePuzzleShapes(SAMPLE);
  console.log(result);
  expect(result.length).toBe(32);
});
