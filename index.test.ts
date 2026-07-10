import { Rover, Plateau, MarsRoverMission } from "./index";

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
});
