import type { Cell } from "../../shared/api";

export interface Visit extends Cell {
  // Playback step at which the square is first visited. Step n shows the first n entries of the trail.
  step: number;
}

// Distinct squares in order of first visit, so the squares visited by step n are always a prefix.
export function firstVisits(trail: Cell[]): Visit[] {
  const seen = new Set<string>();
  const visits: Visit[] = [];
  trail.forEach(({ x, y }, index) => {
    const key = `${x},${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    visits.push({ x, y, step: index + 1 });
  });
  return visits;
}

export function visitedBy(visits: Visit[], step: number): Visit[] {
  return visits.filter((visit) => visit.step <= step);
}
