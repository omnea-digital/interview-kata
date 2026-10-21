type Direction = "N" | "S" | "E" | "W";

interface Position {
  x: number;
  y: number;
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

  turnLeft(): void {
    this.direction = turnLeft(this.direction);
  }

  turnRight(): void {
    this.direction = turnRight(this.direction);
  }

  moveForward(plateau: Plateau): void {
    const [dx, dy] = getMovementVector(this.direction);
    const newX = this.position.x + dx;
    const newY = this.position.y + dy;

    if (plateau.isWithinBounds(newX, newY)) {
      this.position.x = newX;
      this.position.y = newY;
    }
  }

  executeCommands(commands: string, plateau: Plateau): void {
    for (const command of commands) {
      if (command === "L") {
        this.turnLeft();
      } else if (command === "R") {
        this.turnRight();
      } else if (command === "M") {
        this.moveForward(plateau);
      }
    }
  }

  toString(): string {
    return `${this.position.x} ${this.position.y} ${this.direction}`;
  }
}

export class Plateau {
  private maxX: number;
  private maxY: number;

  constructor(maxX: number, maxY: number) {
    this.maxX = maxX;
    this.maxY = maxY;
  }

  isWithinBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY;
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

  constructor(maxX: number, maxY: number) {
    this.plateau = new Plateau(maxX, maxY);
  }

  addRover(rover: Rover): void {
    this.rovers.push(rover);
  }

  executeRoverCommands(roverIndex: number, commands: string): void {
    if (roverIndex >= 0 && roverIndex < this.rovers.length) {
      this.rovers[roverIndex].executeCommands(commands, this.plateau);
    }
  }

  getRoverPositions(): string[] {
    return this.rovers.map((rover) => rover.toString());
  }

  getRoverOutput(): string {
    return this.getRoverPositions().join("\n");
  }

  static parseInput(input: string): MarsRoverMission {
    const lines = input.trim().split("\n");
    if (lines.length % 2 === 0) {
      throw new Error("Each rover needs a position line and a commands line");
    }

    const plateauMatch = lines[0].match(/^(\d+)\s+(\d+)$/);
    if (!plateauMatch) throw new Error(`Invalid plateau: "${lines[0]}"`);
    const mission = new MarsRoverMission(Number(plateauMatch[1]), Number(plateauMatch[2]));

    for (let i = 1; i < lines.length; i += 2) {
      const positionMatch = lines[i].match(/^(\d+)\s+(\d+)\s+([NESW])$/);
      if (!positionMatch) throw new Error(`Invalid rover position: "${lines[i]}"`);
      const x = Number(positionMatch[1]);
      const y = Number(positionMatch[2]);
      const direction = positionMatch[3] as Direction;
      if (!mission.plateau.isWithinBounds(x, y)) {
        throw new Error(`Rover position outside plateau: "${lines[i]}"`);
      }

      const rover = new Rover(x, y, direction);
      mission.addRover(rover);

      const commands = lines[i + 1];
      if (!/^[LRM]*$/.test(commands)) throw new Error(`Invalid commands: "${commands}"`);
      mission.executeRoverCommands(mission.rovers.length - 1, commands);
    }

    return mission;
  }
}
