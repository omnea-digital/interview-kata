from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, cast

Direction = Literal["N", "S", "E", "W"]


@dataclass(frozen=True)
class Position:
    x: int
    y: int


DIRECTIONS: list[Direction] = ["N", "E", "S", "W"]


def _turn_left(direction: Direction) -> Direction:
    index = DIRECTIONS.index(direction)
    return DIRECTIONS[(index - 1) % 4]


def _turn_right(direction: Direction) -> Direction:
    index = DIRECTIONS.index(direction)
    return DIRECTIONS[(index + 1) % 4]


def _movement_vector(direction: Direction) -> tuple[int, int]:
    match direction:
        case "N":
            return (0, 1)
        case "S":
            return (0, -1)
        case "E":
            return (1, 0)
        case "W":
            return (-1, 0)


class Plateau:
    def __init__(self, max_x: int, max_y: int) -> None:
        self._max_x = max_x
        self._max_y = max_y

    @property
    def max_x(self) -> int:
        return self._max_x

    @property
    def max_y(self) -> int:
        return self._max_y

    def is_within_bounds(self, x: int, y: int) -> bool:
        return 0 <= x <= self._max_x and 0 <= y <= self._max_y


class Rover:
    def __init__(self, x: int, y: int, direction: Direction) -> None:
        self._position = Position(x, y)
        self._direction: Direction = direction

    @property
    def position(self) -> Position:
        return self._position

    @property
    def direction(self) -> Direction:
        return self._direction

    def turn_left(self) -> None:
        self._direction = _turn_left(self._direction)

    def turn_right(self) -> None:
        self._direction = _turn_right(self._direction)

    def move_forward(self, plateau: Plateau) -> None:
        dx, dy = _movement_vector(self._direction)
        new_x = self._position.x + dx
        new_y = self._position.y + dy

        if plateau.is_within_bounds(new_x, new_y):
            self._position = Position(new_x, new_y)

    def execute_commands(self, commands: str, plateau: Plateau) -> None:
        for command in commands:
            if command == "L":
                self.turn_left()
            elif command == "R":
                self.turn_right()
            elif command == "M":
                self.move_forward(plateau)

    def __str__(self) -> str:
        return f"{self._position.x} {self._position.y} {self._direction}"


class MarsRoverMission:
    def __init__(self, max_x: int, max_y: int) -> None:
        self._plateau = Plateau(max_x, max_y)
        self._rovers: list[Rover] = []

    def add_rover(self, rover: Rover) -> None:
        self._rovers.append(rover)

    def execute_rover_commands(self, rover_index: int, commands: str) -> None:
        if 0 <= rover_index < len(self._rovers):
            self._rovers[rover_index].execute_commands(commands, self._plateau)

    def get_rover_positions(self) -> list[str]:
        return [str(rover) for rover in self._rovers]

    def get_rover_output(self) -> str:
        return "\n".join(self.get_rover_positions())

    @staticmethod
    def parse_input(input_text: str) -> MarsRoverMission:
        lines = input_text.strip().split("\n")
        max_x, max_y = (int(value) for value in lines[0].split(" "))
        mission = MarsRoverMission(max_x, max_y)

        for i in range(1, len(lines), 2):
            x_token, y_token, direction_token = lines[i].split(" ")
            direction = cast(Direction, direction_token)

            rover = Rover(int(x_token), int(y_token), direction)
            mission.add_rover(rover)

            commands = lines[i + 1]
            mission.execute_rover_commands(len(mission._rovers) - 1, commands)

        return mission
