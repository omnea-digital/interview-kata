import { Rover, Plateau, MarsRoverMission, InputError } from "./index";

describe("Rover", () => {
  let plateau: Plateau;

  beforeEach(() => {
    plateau = new Plateau(5, 5);
  });

  describe("initialization", () => {
    it("should initialize with correct position and direction", () => {
      const rover = new Rover(1, 2, "N");
      expect(rover.getPosition()).toEqual({ x: 1, y: 2 });
      expect(rover.getDirection()).toBe("N");
    });

    it("should have correct string representation", () => {
      const rover = new Rover(1, 3, "N");
      expect(rover.toString()).toBe("1 3 N");
    });
  });

  describe("turning", () => {
    it("should turn left from North to West", () => {
      const rover = new Rover(0, 0, "N");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("W");
    });

    it("should turn left from West to South", () => {
      const rover = new Rover(0, 0, "W");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("S");
    });

    it("should turn left from South to East", () => {
      const rover = new Rover(0, 0, "S");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("E");
    });

    it("should turn left from East to North", () => {
      const rover = new Rover(0, 0, "E");
      rover.turnLeft();
      expect(rover.getDirection()).toBe("N");
    });

    it("should turn right from North to East", () => {
      const rover = new Rover(0, 0, "N");
      rover.turnRight();
      expect(rover.getDirection()).toBe("E");
    });

    it("should turn right from East to South", () => {
      const rover = new Rover(0, 0, "E");
      rover.turnRight();
      expect(rover.getDirection()).toBe("S");
    });

    it("should turn right from South to West", () => {
      const rover = new Rover(0, 0, "S");
      rover.turnRight();
      expect(rover.getDirection()).toBe("W");
    });

    it("should turn right from West to North", () => {
      const rover = new Rover(0, 0, "W");
      rover.turnRight();
      expect(rover.getDirection()).toBe("N");
    });
  });

  describe("moving", () => {
    it("should move north", () => {
      const rover = new Rover(1, 2, "N");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 1, y: 3 });
    });

    it("should move south", () => {
      const rover = new Rover(1, 2, "S");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 1, y: 1 });
    });

    it("should move east", () => {
      const rover = new Rover(1, 2, "E");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 2, y: 2 });
    });

    it("should move west", () => {
      const rover = new Rover(1, 2, "W");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 0, y: 2 });
    });

    it("should not move beyond upper-right boundary", () => {
      const rover = new Rover(5, 5, "N");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 5, y: 5 });
    });

    it("should not move beyond left boundary", () => {
      const rover = new Rover(0, 0, "W");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it("should not move beyond bottom boundary", () => {
      const rover = new Rover(0, 0, "S");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 0, y: 0 });
    });

    it("should not move beyond right boundary", () => {
      const rover = new Rover(5, 5, "E");
      rover.moveForward(plateau);
      expect(rover.getPosition()).toEqual({ x: 5, y: 5 });
    });
  });

  describe("executing commands", () => {
    it("should execute single turn left command", () => {
      const rover = new Rover(0, 0, "N");
      rover.executeCommands("L", plateau);
      expect(rover.getDirection()).toBe("W");
    });

    it("should execute single turn right command", () => {
      const rover = new Rover(0, 0, "N");
      rover.executeCommands("R", plateau);
      expect(rover.getDirection()).toBe("E");
    });

    it("should execute single move command", () => {
      const rover = new Rover(0, 0, "N");
      rover.executeCommands("M", plateau);
      expect(rover.getPosition()).toEqual({ x: 0, y: 1 });
    });

    it("should execute sequence: LMLMLMLMM", () => {
      const rover = new Rover(1, 2, "N");
      rover.executeCommands("LMLMLMLMM", plateau);
      expect(rover.toString()).toBe("1 3 N");
    });

    it("should execute sequence: MMRMMRMRRM", () => {
      const rover = new Rover(3, 3, "E");
      rover.executeCommands("MMRMMRMRRM", plateau);
      expect(rover.toString()).toBe("5 1 E");
    });

    it("should ignore invalid commands", () => {
      const rover = new Rover(0, 0, "N");
      rover.executeCommands("LXMYL", plateau);
      expect(rover.toString()).toBe("0 0 S");
    });

    it("should handle empty command string", () => {
      const rover = new Rover(1, 2, "N");
      rover.executeCommands("", plateau);
      expect(rover.toString()).toBe("1 2 N");
    });
  });

  describe("obstacles", () => {
    let rockyPlateau: Plateau;

    beforeEach(() => {
      rockyPlateau = new Plateau(5, 5, [{ x: 1, y: 3 }]);
    });

    it("should not move onto an obstacle", () => {
      const rover = new Rover(1, 2, "N");
      rover.moveForward(rockyPlateau);
      expect(rover.getPosition()).toEqual({ x: 1, y: 2 });
      expect(rover.isBlocked()).toBe(true);
    });

    it("should stop at the last free square and abort remaining commands", () => {
      const rover = new Rover(1, 1, "N");
      rover.executeCommands("MMRM", rockyPlateau);
      expect(rover.toString()).toBe("1 2 N O");
    });

    it("should navigate around an obstacle", () => {
      const rover = new Rover(1, 2, "N");
      rover.executeCommands("RMLMM", rockyPlateau);
      expect(rover.toString()).toBe("2 4 N");
      expect(rover.isBlocked()).toBe(false);
    });

    it("should clear the blocked state on the next command sequence", () => {
      const rover = new Rover(1, 2, "N");
      rover.executeCommands("M", rockyPlateau);
      rover.executeCommands("RM", rockyPlateau);
      expect(rover.toString()).toBe("2 2 E");
    });

    it("should not treat the plateau edge as an obstacle", () => {
      const rover = new Rover(5, 5, "N");
      rover.executeCommands("MRM", rockyPlateau);
      expect(rover.toString()).toBe("5 5 E");
    });
  });
});

describe("Plateau", () => {
  it("should track boundaries correctly", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.getMaxX()).toBe(5);
    expect(plateau.getMaxY()).toBe(5);
  });

  it("should verify bounds for origin", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.isWithinBounds(0, 0)).toBe(true);
  });

  it("should verify bounds for upper-right", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.isWithinBounds(5, 5)).toBe(true);
  });

  it("should reject coordinates beyond upper-right", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.isWithinBounds(6, 5)).toBe(false);
    expect(plateau.isWithinBounds(5, 6)).toBe(false);
  });

  it("should reject negative coordinates", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.isWithinBounds(-1, 0)).toBe(false);
    expect(plateau.isWithinBounds(0, -1)).toBe(false);
  });

  it("should have no obstacles by default", () => {
    const plateau = new Plateau(5, 5);
    expect(plateau.hasObstacle(0, 0)).toBe(false);
  });

  it("should report obstacles", () => {
    const plateau = new Plateau(5, 5, [
      { x: 1, y: 3 },
      { x: 4, y: 0 },
    ]);
    expect(plateau.hasObstacle(1, 3)).toBe(true);
    expect(plateau.hasObstacle(4, 0)).toBe(true);
    expect(plateau.hasObstacle(3, 1)).toBe(false);
    expect(plateau.getObstacles()).toEqual([
      { x: 1, y: 3 },
      { x: 4, y: 0 },
    ]);
  });
});

describe("MarsRoverMission", () => {
  it("should create mission with correct plateau", () => {
    const mission = new MarsRoverMission(5, 5);
    expect(mission.getRoverPositions()).toEqual([]);
  });

  it("should add rovers to mission", () => {
    const mission = new MarsRoverMission(5, 5);
    const rover1 = new Rover(1, 2, "N");
    const rover2 = new Rover(3, 3, "E");

    mission.addRover(rover1);
    mission.addRover(rover2);

    expect(mission.getRoverPositions()).toEqual(["1 2 N", "3 3 E"]);
  });

  it("should execute commands for specific rover", () => {
    const mission = new MarsRoverMission(5, 5);
    const rover = new Rover(1, 2, "N");
    mission.addRover(rover);

    mission.executeRoverCommands(0, "LMLMLMLMM");
    expect(mission.getRoverPositions()).toEqual(["1 3 N"]);
  });

  it("should handle multiple rovers independently", () => {
    const mission = new MarsRoverMission(5, 5);
    mission.addRover(new Rover(1, 2, "N"));
    mission.addRover(new Rover(3, 3, "E"));

    mission.executeRoverCommands(0, "LMLMLMLMM");
    mission.executeRoverCommands(1, "MMRMMRMRRM");

    expect(mission.getRoverPositions()).toEqual(["1 3 N", "5 1 E"]);
  });

  it("should not execute commands for invalid rover index", () => {
    const mission = new MarsRoverMission(5, 5);
    const rover = new Rover(0, 0, "N");
    mission.addRover(rover);

    mission.executeRoverCommands(5, "M");
    expect(mission.getRoverPositions()).toEqual(["0 0 N"]);
  });

  describe("trail", () => {
    it("should start with each rover's landing square", () => {
      const mission = new MarsRoverMission(5, 5);
      mission.addRover(new Rover(1, 2, "N"));
      mission.addRover(new Rover(3, 3, "E"));
      expect(mission.getTrail()).toEqual([
        { x: 1, y: 2 },
        { x: 3, y: 3 },
      ]);
    });

    it("should record squares in the order rovers enter them", () => {
      const mission = new MarsRoverMission(5, 5);
      mission.addRover(new Rover(0, 0, "N"));
      mission.executeRoverCommands(0, "MRM");
      mission.addRover(new Rover(5, 5, "S"));
      mission.executeRoverCommands(1, "M");
      expect(mission.getTrail()).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 5, y: 5 },
        { x: 5, y: 4 },
      ]);
    });

    it("should include revisits so playback can follow the rover", () => {
      const mission = new MarsRoverMission(5, 5);
      mission.addRover(new Rover(0, 0, "N"));
      mission.executeRoverCommands(0, "MRRM");
      expect(mission.getTrail()).toEqual([
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 0 },
      ]);
    });

    it("should not record moves blocked by the edge or an obstacle", () => {
      const mission = new MarsRoverMission(5, 5, [{ x: 1, y: 0 }]);
      mission.addRover(new Rover(0, 0, "S"));
      mission.executeRoverCommands(0, "MLM");
      expect(mission.getTrail()).toEqual([{ x: 0, y: 0 }]);
    });

    it("should not be affected by mutating the returned trail", () => {
      const mission = new MarsRoverMission(5, 5);
      mission.addRover(new Rover(0, 0, "N"));
      mission.getTrail()[0].x = 3;
      expect(mission.getTrail()).toEqual([{ x: 0, y: 0 }]);
    });
  });
});

describe("MarsRoverMission.parseInput", () => {
  it("should parse example input correctly", () => {
    const input = `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`;

    const mission = MarsRoverMission.parseInput(input);
    expect(mission.getRoverOutput()).toBe(`1 3 N
5 1 E`);
  });

  it("should accept Windows line endings", () => {
    const mission = MarsRoverMission.parseInput("5 5\r\nO 1 3\r\n1 2 N\r\nMM\r\n");
    expect(mission.getRoverOutput()).toBe("1 2 N O");
  });

  it("should throw InputError for malformed input", () => {
    expect(() => MarsRoverMission.parseInput("nonsense")).toThrow(InputError);
  });

  it("should parse single rover", () => {
    const input = `5 5
0 0 N
MMM`;

    const mission = MarsRoverMission.parseInput(input);
    expect(mission.getRoverOutput()).toBe(`0 3 N`);
  });

  it("should handle input with extra whitespace", () => {
    const input = `  5 5
1 2 N
LMLMLMLMM`;

    const mission = MarsRoverMission.parseInput(input);
    expect(mission.getRoverOutput()).toBe(`1 3 N`);
  });

  it("should handle multiple rovers in sequence", () => {
    const input = `10 10
0 0 N
M
5 5 E
M`;

    const mission = MarsRoverMission.parseInput(input);
    expect(mission.getRoverOutput()).toBe(`0 1 N
6 5 E`);
  });

  it("should parse obstacles and report blocked rovers", () => {
    const input = `5 5
O 1 3
O 4 4
1 2 N
MRM
3 3 E
M`;

    const mission = MarsRoverMission.parseInput(input);
    expect(mission.getRoverOutput()).toBe(`1 2 N O
4 3 E`);
  });

  it("should accept obstacles with no rovers", () => {
    const mission = MarsRoverMission.parseInput(`5 5
O 1 1`);
    expect(mission.getRoverOutput()).toBe("");
  });

  it.each([
    [
      "invalid plateau",
      `5 x
1 2 N
M`,
      "Invalid plateau",
    ],
    [
      "negative plateau",
      `-5 5
1 2 N
M`,
      "Invalid plateau",
    ],
    [
      "invalid direction",
      `5 5
1 2 Q
M`,
      "Invalid rover position",
    ],
    [
      "missing coordinate",
      `5 5
1 N
M`,
      "Invalid rover position",
    ],
    [
      "rover outside plateau",
      `5 5
6 2 N
M`,
      "outside plateau",
    ],
    [
      "invalid command",
      `5 5
1 2 N
MXM`,
      "Invalid commands",
    ],
    [
      "missing commands line",
      `5 5
1 2 N`,
      "position line and a commands line",
    ],
    [
      "malformed obstacle",
      `5 5
O 1
1 2 N
M`,
      "Invalid obstacle",
    ],
    [
      "obstacle outside plateau",
      `5 5
O 6 1
1 2 N
M`,
      "Obstacle outside plateau",
    ],
    [
      "obstacle after a rover",
      `5 5
1 2 N
M
O 3 3`,
      "position line and a commands line",
    ],
    [
      "rover starting on an obstacle",
      `5 5
O 1 2
1 2 N
M`,
      "Rover position on obstacle",
    ],
  ])("should throw on %s", (_, input, message) => {
    expect(() => MarsRoverMission.parseInput(input)).toThrow(message);
  });
});
