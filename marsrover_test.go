package marsrover

import (
	"slices"
	"strings"
	"testing"
)

func TestRoverInitialization(t *testing.T) {
	t.Run("initializes with correct position and direction", func(t *testing.T) {
		rover := NewRover(1, 2, North)
		if got, want := rover.Position(), (Position{X: 1, Y: 2}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
		if got := rover.Direction(); got != North {
			t.Errorf("Direction() = %q, want %q", got, North)
		}
	})

	t.Run("has correct string representation", func(t *testing.T) {
		rover := NewRover(1, 3, North)
		if got, want := rover.String(), "1 3 N"; got != want {
			t.Errorf("String() = %q, want %q", got, want)
		}
	})
}

func TestRoverTurning(t *testing.T) {
	t.Run("turns left from North to West", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.TurnLeft()
		if got := rover.Direction(); got != West {
			t.Errorf("Direction() = %q, want %q", got, West)
		}
	})

	t.Run("turns left from West to South", func(t *testing.T) {
		rover := NewRover(0, 0, West)
		rover.TurnLeft()
		if got := rover.Direction(); got != South {
			t.Errorf("Direction() = %q, want %q", got, South)
		}
	})

	t.Run("turns left from South to East", func(t *testing.T) {
		rover := NewRover(0, 0, South)
		rover.TurnLeft()
		if got := rover.Direction(); got != East {
			t.Errorf("Direction() = %q, want %q", got, East)
		}
	})

	t.Run("turns left from East to North", func(t *testing.T) {
		rover := NewRover(0, 0, East)
		rover.TurnLeft()
		if got := rover.Direction(); got != North {
			t.Errorf("Direction() = %q, want %q", got, North)
		}
	})

	t.Run("turns right from North to East", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.TurnRight()
		if got := rover.Direction(); got != East {
			t.Errorf("Direction() = %q, want %q", got, East)
		}
	})

	t.Run("turns right from East to South", func(t *testing.T) {
		rover := NewRover(0, 0, East)
		rover.TurnRight()
		if got := rover.Direction(); got != South {
			t.Errorf("Direction() = %q, want %q", got, South)
		}
	})

	t.Run("turns right from South to West", func(t *testing.T) {
		rover := NewRover(0, 0, South)
		rover.TurnRight()
		if got := rover.Direction(); got != West {
			t.Errorf("Direction() = %q, want %q", got, West)
		}
	})

	t.Run("turns right from West to North", func(t *testing.T) {
		rover := NewRover(0, 0, West)
		rover.TurnRight()
		if got := rover.Direction(); got != North {
			t.Errorf("Direction() = %q, want %q", got, North)
		}
	})
}

func TestRoverMoving(t *testing.T) {
	plateau := NewPlateau(5, 5)

	t.Run("moves north", func(t *testing.T) {
		rover := NewRover(1, 2, North)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 1, Y: 3}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("moves south", func(t *testing.T) {
		rover := NewRover(1, 2, South)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 1, Y: 1}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("moves east", func(t *testing.T) {
		rover := NewRover(1, 2, East)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 2, Y: 2}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("moves west", func(t *testing.T) {
		rover := NewRover(1, 2, West)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 0, Y: 2}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("does not move beyond upper-right boundary", func(t *testing.T) {
		rover := NewRover(5, 5, North)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 5, Y: 5}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("does not move beyond left boundary", func(t *testing.T) {
		rover := NewRover(0, 0, West)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 0, Y: 0}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("does not move beyond bottom boundary", func(t *testing.T) {
		rover := NewRover(0, 0, South)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 0, Y: 0}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("does not move beyond right boundary", func(t *testing.T) {
		rover := NewRover(5, 5, East)
		rover.MoveForward(plateau)
		if got, want := rover.Position(), (Position{X: 5, Y: 5}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})
}

func TestRoverExecuteCommands(t *testing.T) {
	plateau := NewPlateau(5, 5)

	t.Run("executes single turn left command", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.ExecuteCommands("L", plateau)
		if got := rover.Direction(); got != West {
			t.Errorf("Direction() = %q, want %q", got, West)
		}
	})

	t.Run("executes single turn right command", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.ExecuteCommands("R", plateau)
		if got := rover.Direction(); got != East {
			t.Errorf("Direction() = %q, want %q", got, East)
		}
	})

	t.Run("executes single move command", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.ExecuteCommands("M", plateau)
		if got, want := rover.Position(), (Position{X: 0, Y: 1}); got != want {
			t.Errorf("Position() = %v, want %v", got, want)
		}
	})

	t.Run("executes sequence LMLMLMLMM", func(t *testing.T) {
		rover := NewRover(1, 2, North)
		rover.ExecuteCommands("LMLMLMLMM", plateau)
		if got, want := rover.String(), "1 3 N"; got != want {
			t.Errorf("String() = %q, want %q", got, want)
		}
	})

	t.Run("executes sequence MMRMMRMRRM", func(t *testing.T) {
		rover := NewRover(3, 3, East)
		rover.ExecuteCommands("MMRMMRMRRM", plateau)
		if got, want := rover.String(), "5 1 E"; got != want {
			t.Errorf("String() = %q, want %q", got, want)
		}
	})

	t.Run("ignores invalid commands", func(t *testing.T) {
		rover := NewRover(0, 0, North)
		rover.ExecuteCommands("LXMYL", plateau)
		if got, want := rover.String(), "0 0 S"; got != want {
			t.Errorf("String() = %q, want %q", got, want)
		}
	})

	t.Run("handles empty command string", func(t *testing.T) {
		rover := NewRover(1, 2, North)
		rover.ExecuteCommands("", plateau)
		if got, want := rover.String(), "1 2 N"; got != want {
			t.Errorf("String() = %q, want %q", got, want)
		}
	})
}

func TestPlateau(t *testing.T) {
	t.Run("tracks boundaries correctly", func(t *testing.T) {
		plateau := NewPlateau(5, 5)
		if got := plateau.MaxX(); got != 5 {
			t.Errorf("MaxX() = %d, want 5", got)
		}
		if got := plateau.MaxY(); got != 5 {
			t.Errorf("MaxY() = %d, want 5", got)
		}
	})

	t.Run("verifies bounds for origin", func(t *testing.T) {
		plateau := NewPlateau(5, 5)
		if !plateau.IsWithinBounds(0, 0) {
			t.Error("IsWithinBounds(0, 0) = false, want true")
		}
	})

	t.Run("verifies bounds for upper-right", func(t *testing.T) {
		plateau := NewPlateau(5, 5)
		if !plateau.IsWithinBounds(5, 5) {
			t.Error("IsWithinBounds(5, 5) = false, want true")
		}
	})

	t.Run("rejects coordinates beyond upper-right", func(t *testing.T) {
		plateau := NewPlateau(5, 5)
		if plateau.IsWithinBounds(6, 5) {
			t.Error("IsWithinBounds(6, 5) = true, want false")
		}
		if plateau.IsWithinBounds(5, 6) {
			t.Error("IsWithinBounds(5, 6) = true, want false")
		}
	})

	t.Run("rejects negative coordinates", func(t *testing.T) {
		plateau := NewPlateau(5, 5)
		if plateau.IsWithinBounds(-1, 0) {
			t.Error("IsWithinBounds(-1, 0) = true, want false")
		}
		if plateau.IsWithinBounds(0, -1) {
			t.Error("IsWithinBounds(0, -1) = true, want false")
		}
	})
}

func TestMarsRoverMission(t *testing.T) {
	t.Run("creates mission with no rovers", func(t *testing.T) {
		mission := NewMarsRoverMission(5, 5)
		if got := mission.RoverPositions(); len(got) != 0 {
			t.Errorf("RoverPositions() = %v, want empty", got)
		}
	})

	t.Run("adds rovers to mission", func(t *testing.T) {
		mission := NewMarsRoverMission(5, 5)
		mission.AddRover(NewRover(1, 2, North))
		mission.AddRover(NewRover(3, 3, East))

		want := []string{"1 2 N", "3 3 E"}
		if got := mission.RoverPositions(); !slices.Equal(got, want) {
			t.Errorf("RoverPositions() = %v, want %v", got, want)
		}
	})

	t.Run("executes commands for specific rover", func(t *testing.T) {
		mission := NewMarsRoverMission(5, 5)
		mission.AddRover(NewRover(1, 2, North))

		mission.ExecuteRoverCommands(0, "LMLMLMLMM")

		want := []string{"1 3 N"}
		if got := mission.RoverPositions(); !slices.Equal(got, want) {
			t.Errorf("RoverPositions() = %v, want %v", got, want)
		}
	})

	t.Run("handles multiple rovers independently", func(t *testing.T) {
		mission := NewMarsRoverMission(5, 5)
		mission.AddRover(NewRover(1, 2, North))
		mission.AddRover(NewRover(3, 3, East))

		mission.ExecuteRoverCommands(0, "LMLMLMLMM")
		mission.ExecuteRoverCommands(1, "MMRMMRMRRM")

		want := []string{"1 3 N", "5 1 E"}
		if got := mission.RoverPositions(); !slices.Equal(got, want) {
			t.Errorf("RoverPositions() = %v, want %v", got, want)
		}
	})

	t.Run("does not execute commands for invalid rover index", func(t *testing.T) {
		mission := NewMarsRoverMission(5, 5)
		mission.AddRover(NewRover(0, 0, North))

		mission.ExecuteRoverCommands(5, "M")

		want := []string{"0 0 N"}
		if got := mission.RoverPositions(); !slices.Equal(got, want) {
			t.Errorf("RoverPositions() = %v, want %v", got, want)
		}
	})
}

func TestParseInput(t *testing.T) {
	t.Run("parses example input correctly", func(t *testing.T) {
		input := `5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM`

		mission, err := ParseInput(input)
		if err != nil {
			t.Fatalf("ParseInput() error = %v", err)
		}
		want := `1 3 N
5 1 E`
		if got := mission.RoverOutput(); got != want {
			t.Errorf("RoverOutput() = %q, want %q", got, want)
		}
	})

	t.Run("parses single rover", func(t *testing.T) {
		input := `5 5
0 0 N
MMM`

		mission, err := ParseInput(input)
		if err != nil {
			t.Fatalf("ParseInput() error = %v", err)
		}
		if got, want := mission.RoverOutput(), `0 3 N`; got != want {
			t.Errorf("RoverOutput() = %q, want %q", got, want)
		}
	})

	t.Run("handles input with extra whitespace", func(t *testing.T) {
		input := `  5 5
1 2 N
LMLMLMLMM`

		mission, err := ParseInput(input)
		if err != nil {
			t.Fatalf("ParseInput() error = %v", err)
		}
		if got, want := mission.RoverOutput(), `1 3 N`; got != want {
			t.Errorf("RoverOutput() = %q, want %q", got, want)
		}
	})

	t.Run("handles multiple rovers in sequence", func(t *testing.T) {
		input := `10 10
0 0 N
M
5 5 E
M`

		mission, err := ParseInput(input)
		if err != nil {
			t.Fatalf("ParseInput() error = %v", err)
		}
		want := `0 1 N
6 5 E`
		if got := mission.RoverOutput(); got != want {
			t.Errorf("RoverOutput() = %q, want %q", got, want)
		}
	})
}

func TestParseInputErrors(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		wantErr string
	}{
		{
			name: "invalid plateau",
			input: `5 x
1 2 N
M`,
			wantErr: "invalid plateau",
		},
		{
			name: "negative plateau",
			input: `-5 5
1 2 N
M`,
			wantErr: "invalid plateau",
		},
		{
			name: "invalid direction",
			input: `5 5
1 2 Q
M`,
			wantErr: "invalid rover position",
		},
		{
			name: "missing coordinate",
			input: `5 5
1 N
M`,
			wantErr: "invalid rover position",
		},
		{
			name: "rover outside plateau",
			input: `5 5
6 2 N
M`,
			wantErr: "outside plateau",
		},
		{
			name: "invalid command",
			input: `5 5
1 2 N
MXM`,
			wantErr: "invalid commands",
		},
		{
			name: "missing commands line",
			input: `5 5
1 2 N`,
			wantErr: "position line and a commands line",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mission, err := ParseInput(tt.input)
			if err == nil {
				t.Fatalf("ParseInput() = %v, want error containing %q", mission, tt.wantErr)
			}
			if !strings.Contains(err.Error(), tt.wantErr) {
				t.Errorf("ParseInput() error = %q, want error containing %q", err, tt.wantErr)
			}
		})
	}
}
