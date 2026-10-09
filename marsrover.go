package marsrover

import (
	"fmt"
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

func ParseInput(input string) *MarsRoverMission {
	lines := strings.Split(strings.TrimSpace(input), "\n")
	plateauLine := strings.Split(lines[0], " ")
	maxX, _ := strconv.Atoi(plateauLine[0])
	maxY, _ := strconv.Atoi(plateauLine[1])
	mission := NewMarsRoverMission(maxX, maxY)

	for i := 1; i < len(lines); i += 2 {
		positionLine := strings.Split(lines[i], " ")
		x, _ := strconv.Atoi(positionLine[0])
		y, _ := strconv.Atoi(positionLine[1])
		direction := Direction(positionLine[2])

		rover := NewRover(x, y, direction)
		mission.AddRover(rover)

		commands := lines[i+1]
		mission.ExecuteRoverCommands(len(mission.rovers)-1, commands)
	}

	return mission
}
