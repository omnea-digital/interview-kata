package marsrover

import (
	"errors"
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

type Direction string

const (
	North Direction = "N"
	South Direction = "S"
	East  Direction = "E"
	West  Direction = "W"
)

type Position struct {
	X int
	Y int
}

var directions = []Direction{North, East, South, West}

func directionIndex(dir Direction) int {
	for i, d := range directions {
		if d == dir {
			return i
		}
	}
	return -1
}

func turnLeft(dir Direction) Direction {
	index := directionIndex(dir)
	return directions[(index-1+4)%4]
}

func turnRight(dir Direction) Direction {
	index := directionIndex(dir)
	return directions[(index+1)%4]
}

func movementVector(dir Direction) (int, int) {
	switch dir {
	case North:
		return 0, 1
	case South:
		return 0, -1
	case East:
		return 1, 0
	case West:
		return -1, 0
	}
	return 0, 0
}

type Rover struct {
	position  Position
	direction Direction
}

func NewRover(x, y int, direction Direction) *Rover {
	return &Rover{
		position:  Position{X: x, Y: y},
		direction: direction,
	}
}

func (r *Rover) Position() Position {
	return r.position
}

func (r *Rover) Direction() Direction {
	return r.direction
}

func (r *Rover) TurnLeft() {
	r.direction = turnLeft(r.direction)
}

func (r *Rover) TurnRight() {
	r.direction = turnRight(r.direction)
}

func (r *Rover) MoveForward(plateau *Plateau) {
	dx, dy := movementVector(r.direction)
	newX := r.position.X + dx
	newY := r.position.Y + dy

	if plateau.IsWithinBounds(newX, newY) {
		r.position.X = newX
		r.position.Y = newY
	}
}

func (r *Rover) ExecuteCommands(commands string, plateau *Plateau) {
	for _, command := range commands {
		switch command {
		case 'L':
			r.TurnLeft()
		case 'R':
			r.TurnRight()
		case 'M':
			r.MoveForward(plateau)
		}
	}
}

func (r *Rover) String() string {
	return fmt.Sprintf("%d %d %s", r.position.X, r.position.Y, r.direction)
}

type Plateau struct {
	maxX int
	maxY int
}

func NewPlateau(maxX, maxY int) *Plateau {
	return &Plateau{maxX: maxX, maxY: maxY}
}

func (p *Plateau) IsWithinBounds(x, y int) bool {
	return x >= 0 && x <= p.maxX && y >= 0 && y <= p.maxY
}

func (p *Plateau) MaxX() int {
	return p.maxX
}

func (p *Plateau) MaxY() int {
	return p.maxY
}

type MarsRoverMission struct {
	plateau *Plateau
	rovers  []*Rover
}

func NewMarsRoverMission(maxX, maxY int) *MarsRoverMission {
	return &MarsRoverMission{
		plateau: NewPlateau(maxX, maxY),
		rovers:  []*Rover{},
	}
}

func (m *MarsRoverMission) AddRover(rover *Rover) {
	m.rovers = append(m.rovers, rover)
}

func (m *MarsRoverMission) ExecuteRoverCommands(roverIndex int, commands string) {
	if roverIndex >= 0 && roverIndex < len(m.rovers) {
		m.rovers[roverIndex].ExecuteCommands(commands, m.plateau)
	}
}

func (m *MarsRoverMission) RoverPositions() []string {
	positions := make([]string, 0, len(m.rovers))
	for _, rover := range m.rovers {
		positions = append(positions, rover.String())
	}
	return positions
}

func (m *MarsRoverMission) RoverOutput() string {
	return strings.Join(m.RoverPositions(), "\n")
}

var (
	plateauPattern  = regexp.MustCompile(`^(\d+)\s+(\d+)$`)
	positionPattern = regexp.MustCompile(`^(\d+)\s+(\d+)\s+([NESW])$`)
	commandsPattern = regexp.MustCompile(`^[LRM]*$`)
)

func ParseInput(input string) (*MarsRoverMission, error) {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	if len(lines)%2 == 0 {
		return nil, errors.New("each rover needs a position line and a commands line")
	}

	plateauMatch := plateauPattern.FindStringSubmatch(lines[0])
	if plateauMatch == nil {
		return nil, fmt.Errorf("invalid plateau: %q", lines[0])
	}
	maxX, _ := strconv.Atoi(plateauMatch[1])
	maxY, _ := strconv.Atoi(plateauMatch[2])
	mission := NewMarsRoverMission(maxX, maxY)

	for i := 1; i < len(lines); i += 2 {
		positionMatch := positionPattern.FindStringSubmatch(lines[i])
		if positionMatch == nil {
			return nil, fmt.Errorf("invalid rover position: %q", lines[i])
		}
		x, _ := strconv.Atoi(positionMatch[1])
		y, _ := strconv.Atoi(positionMatch[2])
		direction := Direction(positionMatch[3])
		if !mission.plateau.IsWithinBounds(x, y) {
			return nil, fmt.Errorf("rover position outside plateau: %q", lines[i])
		}

		rover := NewRover(x, y, direction)
		mission.AddRover(rover)

		commands := lines[i+1]
		if !commandsPattern.MatchString(commands) {
			return nil, fmt.Errorf("invalid commands: %q", commands)
		}
		mission.ExecuteRoverCommands(len(mission.rovers)-1, commands)
	}

	return mission, nil
}
