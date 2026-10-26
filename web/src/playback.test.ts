import { firstVisits, visitedBy } from "./playback";

describe("firstVisits", () => {
  it("should list each square once, at the step it was first entered", () => {
    const trail = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];

    expect(firstVisits(trail)).toEqual([
      { x: 0, y: 0, step: 1 },
      { x: 0, y: 1, step: 2 },
      { x: 1, y: 0, step: 4 },
    ]);
  });

  it("should handle an empty trail", () => {
    expect(firstVisits([])).toEqual([]);
  });
});

describe("visitedBy", () => {
  const visits = firstVisits([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ]);

  it("should show nothing before playback starts", () => {
    expect(visitedBy(visits, 0)).toEqual([]);
  });

  it("should not count a revisit as a new square", () => {
    expect(visitedBy(visits, 3)).toHaveLength(2);
  });

  it("should show every square at the end", () => {
    expect(visitedBy(visits, 4)).toHaveLength(3);
  });
});
