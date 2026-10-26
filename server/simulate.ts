import { MarsRoverMission } from "../index";
import type { SimulationResult } from "../shared/api";

export function simulate(input: string): SimulationResult {
  const mission = MarsRoverMission.parseInput(input);
  const plateau = mission.getPlateau();

  return {
    plateau: { maxX: plateau.getMaxX(), maxY: plateau.getMaxY() },
    obstacles: plateau.getObstacles(),
    trail: mission.getTrail(),
    rovers: mission.getRovers().map((rover) => ({
      ...rover.getPosition(),
      direction: rover.getDirection(),
      blocked: rover.isBlocked(),
    })),
    output: mission.getRoverOutput(),
  };
}
