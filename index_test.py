import pytest

from index import MarsRoverMission, Plateau, Position, Rover


class TestRover:
    @pytest.fixture
    def plateau(self) -> Plateau:
        return Plateau(5, 5)

    class TestInitialization:
        def test_initializes_with_correct_position_and_direction(self) -> None:
            rover = Rover(1, 2, "N")
            assert rover.position == Position(1, 2)
            assert rover.direction == "N"

        def test_has_correct_string_representation(self) -> None:
            rover = Rover(1, 3, "N")
            assert str(rover) == "1 3 N"

    class TestTurning:
        def test_turns_left_from_north_to_west(self) -> None:
            rover = Rover(0, 0, "N")
            rover.turn_left()
            assert rover.direction == "W"

        def test_turns_left_from_west_to_south(self) -> None:
            rover = Rover(0, 0, "W")
            rover.turn_left()
            assert rover.direction == "S"

        def test_turns_left_from_south_to_east(self) -> None:
            rover = Rover(0, 0, "S")
            rover.turn_left()
            assert rover.direction == "E"

        def test_turns_left_from_east_to_north(self) -> None:
            rover = Rover(0, 0, "E")
            rover.turn_left()
            assert rover.direction == "N"

        def test_turns_right_from_north_to_east(self) -> None:
            rover = Rover(0, 0, "N")
            rover.turn_right()
            assert rover.direction == "E"

        def test_turns_right_from_east_to_south(self) -> None:
            rover = Rover(0, 0, "E")
            rover.turn_right()
            assert rover.direction == "S"

        def test_turns_right_from_south_to_west(self) -> None:
            rover = Rover(0, 0, "S")
            rover.turn_right()
            assert rover.direction == "W"

        def test_turns_right_from_west_to_north(self) -> None:
            rover = Rover(0, 0, "W")
            rover.turn_right()
            assert rover.direction == "N"

    class TestMoving:
        def test_moves_north(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "N")
            rover.move_forward(plateau)
            assert rover.position == Position(1, 3)

        def test_moves_south(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "S")
            rover.move_forward(plateau)
            assert rover.position == Position(1, 1)

        def test_moves_east(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "E")
            rover.move_forward(plateau)
            assert rover.position == Position(2, 2)

        def test_moves_west(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "W")
            rover.move_forward(plateau)
            assert rover.position == Position(0, 2)

        def test_does_not_move_beyond_upper_right_boundary(self, plateau: Plateau) -> None:
            rover = Rover(5, 5, "N")
            rover.move_forward(plateau)
            assert rover.position == Position(5, 5)

        def test_does_not_move_beyond_left_boundary(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "W")
            rover.move_forward(plateau)
            assert rover.position == Position(0, 0)

        def test_does_not_move_beyond_bottom_boundary(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "S")
            rover.move_forward(plateau)
            assert rover.position == Position(0, 0)

        def test_does_not_move_beyond_right_boundary(self, plateau: Plateau) -> None:
            rover = Rover(5, 5, "E")
            rover.move_forward(plateau)
            assert rover.position == Position(5, 5)

    class TestExecutingCommands:
        def test_executes_single_turn_left_command(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "N")
            rover.execute_commands("L", plateau)
            assert rover.direction == "W"

        def test_executes_single_turn_right_command(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "N")
            rover.execute_commands("R", plateau)
            assert rover.direction == "E"

        def test_executes_single_move_command(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "N")
            rover.execute_commands("M", plateau)
            assert rover.position == Position(0, 1)

        def test_executes_sequence_lmlmlmlmm(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "N")
            rover.execute_commands("LMLMLMLMM", plateau)
            assert str(rover) == "1 3 N"

        def test_executes_sequence_mmrmmrmrrm(self, plateau: Plateau) -> None:
            rover = Rover(3, 3, "E")
            rover.execute_commands("MMRMMRMRRM", plateau)
            assert str(rover) == "5 1 E"

        def test_ignores_invalid_commands(self, plateau: Plateau) -> None:
            rover = Rover(0, 0, "N")
            rover.execute_commands("LXMYL", plateau)
            assert str(rover) == "0 0 S"

        def test_handles_empty_command_string(self, plateau: Plateau) -> None:
            rover = Rover(1, 2, "N")
            rover.execute_commands("", plateau)
            assert str(rover) == "1 2 N"


class TestPlateau:
    def test_tracks_boundaries_correctly(self) -> None:
        plateau = Plateau(5, 5)
        assert plateau.max_x == 5
        assert plateau.max_y == 5

    def test_verifies_bounds_for_origin(self) -> None:
        plateau = Plateau(5, 5)
        assert plateau.is_within_bounds(0, 0) is True

    def test_verifies_bounds_for_upper_right(self) -> None:
        plateau = Plateau(5, 5)
        assert plateau.is_within_bounds(5, 5) is True

    def test_rejects_coordinates_beyond_upper_right(self) -> None:
        plateau = Plateau(5, 5)
        assert plateau.is_within_bounds(6, 5) is False
        assert plateau.is_within_bounds(5, 6) is False

    def test_rejects_negative_coordinates(self) -> None:
        plateau = Plateau(5, 5)
        assert plateau.is_within_bounds(-1, 0) is False
        assert plateau.is_within_bounds(0, -1) is False


class TestMarsRoverMission:
    def test_creates_mission_with_correct_plateau(self) -> None:
        mission = MarsRoverMission(5, 5)
        assert mission.get_rover_positions() == []

    def test_adds_rovers_to_mission(self) -> None:
        mission = MarsRoverMission(5, 5)
        rover1 = Rover(1, 2, "N")
        rover2 = Rover(3, 3, "E")

        mission.add_rover(rover1)
        mission.add_rover(rover2)

        assert mission.get_rover_positions() == ["1 2 N", "3 3 E"]

    def test_executes_commands_for_specific_rover(self) -> None:
        mission = MarsRoverMission(5, 5)
        rover = Rover(1, 2, "N")
        mission.add_rover(rover)

        mission.execute_rover_commands(0, "LMLMLMLMM")
        assert mission.get_rover_positions() == ["1 3 N"]

    def test_handles_multiple_rovers_independently(self) -> None:
        mission = MarsRoverMission(5, 5)
        mission.add_rover(Rover(1, 2, "N"))
        mission.add_rover(Rover(3, 3, "E"))

        mission.execute_rover_commands(0, "LMLMLMLMM")
        mission.execute_rover_commands(1, "MMRMMRMRRM")

        assert mission.get_rover_positions() == ["1 3 N", "5 1 E"]

    def test_does_not_execute_commands_for_invalid_rover_index(self) -> None:
        mission = MarsRoverMission(5, 5)
        rover = Rover(0, 0, "N")
        mission.add_rover(rover)

        mission.execute_rover_commands(5, "M")
        assert mission.get_rover_positions() == ["0 0 N"]


class TestParseInput:
    def test_parses_example_input_correctly(self) -> None:
        input_text = "5 5\n1 2 N\nLMLMLMLMM\n3 3 E\nMMRMMRMRRM"

        mission = MarsRoverMission.parse_input(input_text)
        assert mission.get_rover_output() == "1 3 N\n5 1 E"

    def test_parses_single_rover(self) -> None:
        input_text = "5 5\n0 0 N\nMMM"

        mission = MarsRoverMission.parse_input(input_text)
        assert mission.get_rover_output() == "0 3 N"

    def test_handles_input_with_extra_whitespace(self) -> None:
        input_text = "  5 5\n1 2 N\nLMLMLMLMM"

        mission = MarsRoverMission.parse_input(input_text)
        assert mission.get_rover_output() == "1 3 N"

    def test_handles_multiple_rovers_in_sequence(self) -> None:
        input_text = "10 10\n0 0 N\nM\n5 5 E\nM"

        mission = MarsRoverMission.parse_input(input_text)
        assert mission.get_rover_output() == "0 1 N\n6 5 E"
