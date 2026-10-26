export type Direction = "N" | "S" | "E" | "W";

export interface Position {
  x: number;
  y: number;
}

// Thrown for malformed mission input, so callers can tell bad input apart from bugs.
export class InputError extends Error {
  name = "InputError";
}

const DIRECTIONS: Direction[] = ["N", "E", "S", "W"];

function getDirectionIndex(dir: Direction): number {
  return DIRECTIONS.indexOf(dir);
}

function turnLeft(dir: Direction): Direction {
  const index = getDirectionIndex(dir);
  return DIRECTIONS[(index - 1 + 4) % 4];
}

function turnRight(dir: Direction): Direction {
  const index = getDirectionIndex(dir);
  return DIRECTIONS[(index + 1) % 4];
}

function getMovementVector(dir: Direction): [number, number] {
  switch (dir) {
    case "N":
      return [0, 1];
    case "S":
      return [0, -1];
    case "E":
      return [1, 0];
    case "W":
      return [-1, 0];
  }
}

export class Rover {
  private position: Position;
  private direction: Direction;
  private blocked = false;

  constructor(x: number, y: number, direction: Direction) {
    this.position = { x, y };
    this.direction = direction;
  }

  getPosition(): Position {
    return { ...this.position };
  }

  getDirection(): Direction {
    return this.direction;
  }

  isBlocked(): boolean {
    return this.blocked;
  }

  turnLeft(): void {
    this.direction = turnLeft(this.direction);
  }

  turnRight(): void {
    this.direction = turnRight(this.direction);
  }

  // Returns whether the rover actually moved.
  moveForward(plateau: Plateau): boolean {
    const [dx, dy] = getMovementVector(this.direction);
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;

    if (!plateau.isWithinBounds(newX, newY)) return false;
    if (plateau.hasObstacle(newX, newY)) {
      this.blocked = true;
      return false;
    }

    this.position.x = newX;
    this.position.y = newY;
    return true;
  }

  // Hitting an obstacle aborts the rest of the sequence; the rover stays on its last good square.
  // Returns the squares entered, in order.
  executeCommands(commands: string, plateau: Plateau): Position[] {
    const entered: Position[] = [];
    this.blocked = false;
    for (const command of commands) {
      if (this.blocked) break;
      if (command === "L") {
        this.turnLeft();
      } else if (command === "R") {
        this.turnRight();
      } else if (command === "M") {
        if (this.moveForward(plateau)) entered.push(this.getPosition());
      }
    }
    return entered;
  }

  toString(): string {
    const status = this.blocked ? " O" : "";
    return `${this.position.x} ${this.position.y} ${this.direction}${status}`;
  }
}

export class Plateau {
  private maxX: number;
  private maxY: number;
  private obstacles: Position[];
  private obstacleKeys: Set<string>;

  constructor(maxX: number, maxY: number, obstacles: Position[] = []) {
    this.maxX = maxX;
    this.maxY = maxY;
    this.obstacles = obstacles.map((obstacle) => ({ ...obstacle }));
    this.obstacleKeys = new Set(obstacles.map(({ x, y }) => `${x},${y}`));
  }

  isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
  }

  hasObstacle(x: number, y: number): boolean {
    return this.obstacleKeys.has(`${x},${y}`);
  }

  getObstacles(): Position[] {
    return this.obstacles.map((obstacle) => ({ ...obstacle }));
  }

  getMaxX(): number {
    return this.maxX;
  }

  getMaxY(): number {
    return this.maxY;
  }
}

export class MarsRoverMission {
  private plateau: Plateau;
  private rovers: Rover[] = [];
  // Every square a rover has occupied, in the order it happened. Deliberately not tied to a rover.
  private trail: Position[] = [];

  constructor(maxX: number, maxY: number, obstacles: Position[] = []) {
    this.plateau = new Plateau(maxX, maxY, obstacles);
  }

  getPlateau(): Plateau {
    return this.plateau;
  }

  getRovers(): Rover[] {
    return [...this.rovers];
  }

  getTrail(): Position[] {
    return this.trail.map((position) => ({ ...position }));
  }

  addRover(rover: Rover): void {
    this.rovers.push(rover);
    this.trail.push(rover.getPosition());
  }

  executeRoverCommands(roverIndex: number, commands: string): void {
    if (roverIndex >= 0 && roverIndex < this.rovers.length) {
      const entered = this.rovers[roverIndex].executeCommands(commands, this.plateau);
      this.trail.push(...entered);
    }
  }

  getRoverPositions(): string[] {
    return this.rovers.map((rover) => rover.toString());
  }

  getRoverOutput(): string {
    return this.getRoverPositions().join("\n");
  }

  static parseInput(input: string): MarsRoverMission {
    const lines = input.trim().split(/\r?\n/);

    const plateauMatch = lines[0].match(/^(\d+)\s+(\d+)$/);
    if (!plateauMatch) throw new InputError(`Invalid plateau: "${lines[0]}"`);
    const maxX = Number(plateauMatch[1]);
    const maxY = Number(plateauMatch[2]);

    // Optional obstacle lines ("O x y") sit between the plateau and the first rover.
    const obstacles: Position[] = [];
    let first = 1;
    for (; first < lines.length && lines[first].startsWith("O"); first++) {
      const obstacleMatch = lines[first].match(/^O\s+(\d+)\s+(\d+)$/);
      if (!obstacleMatch) throw new InputError(`Invalid obstacle: "${lines[first]}"`);
      const x = Number(obstacleMatch[1]);
      const y = Number(obstacleMatch[2]);
      if (x > maxX || y > maxY) throw new InputError(`Obstacle outside plateau: "${lines[first]}"`);
      obstacles.push({ x, y });
    }

    if ((lines.length - first) % 2 !== 0) {
      throw new InputError("Each rover needs a position line and a commands line");
    }

    const mission = new MarsRoverMission(maxX, maxY, obstacles);

    for (let i = first; i < lines.length; i += 2) {
      const positionMatch = lines[i].match(/^(\d+)\s+(\d+)\s+([NESW])$/);
      if (!positionMatch) throw new InputError(`Invalid rover position: "${lines[i]}"`);
      const x = Number(positionMatch[1]);
      const y = Number(positionMatch[2]);
      const direction = positionMatch[3] as Direction;
      if (!mission.plateau.isWithinBounds(x, y)) {
        throw new InputError(`Rover position outside plateau: "${lines[i]}"`);
      }
      if (mission.plateau.hasObstacle(x, y)) {
        throw new InputError(`Rover position on obstacle: "${lines[i]}"`);
      }

      const rover = new Rover(x, y, direction);
      mission.addRover(rover);

      const commands = lines[i + 1];
      if (!/^[LRM]*$/.test(commands)) throw new InputError(`Invalid commands: "${commands}"`);
      mission.executeRoverCommands(mission.rovers.length - 1, commands);
    }

    return mission;
  }
}
