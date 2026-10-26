// Wire format shared by the server and the web client. Types only, so both sides can import it.

export interface Cell {
  x: number;
  y: number;
}

export interface SimulationRequest {
  input: string;
}

export interface SimulationResult {
  plateau: { maxX: number; maxY: number };
  obstacles: Cell[];
  // Every square occupied by any rover, in order: each rover's start square, then each square it moved into.
  trail: Cell[];
  rovers: {
    x: number;
    y: number;
    direction: "N" | "E" | "S" | "W";
    blocked: boolean;
  }[];
  // The kata's text output, one line per rover.
  output: string;
}

export interface ErrorResponse {
  error: string;
}
