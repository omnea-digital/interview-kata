import { useMemo, useState, type SubmitEvent } from "react";
import type {
  ErrorResponse,
  SimulationRequest,
  SimulationResult,
} from "../../shared/api";
import { PlateauCanvas } from "./PlateauCanvas";
import { firstVisits, visitedBy } from "./playback";
import { usePlayback } from "./usePlayback";

const EXAMPLE_INPUT = `5 5
O 4 1
O 2 4
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
0 0 E
MMMLMMMMM`;

const SPEEDS = [2, 5, 10, 30];

async function runSimulation(input: string): Promise<SimulationResult> {
  const request: SimulationRequest = { input };
  const response = await fetch("/api/simulations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const body: SimulationResult | ErrorResponse | null = await response
    .json()
    .catch(() => null);
  if (!response.ok || !body || "error" in body) {
    throw new Error(
      body && "error" in body
        ? body.error
        : `Request failed (${response.status})`,
    );
  }
  return body;
}

export function App() {
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(5);

  const trail = useMemo(() => result?.trail ?? [], [result]);
  const visits = useMemo(() => firstVisits(trail), [trail]);
  const playback = usePlayback(trail.length, speed);

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setResult(await runSimulation(input));
      playback.restart();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const squares = result
    ? (result.plateau.maxX + 1) * (result.plateau.maxY + 1)
    : 0;
  const visitedCount = visitedBy(visits, playback.step).length;

  return (
    <main className="app">
      <header>
        <h1>Mars Rover Mission</h1>
        <p className="muted">
          Send rovers across the plateau and watch which squares get explored.
        </p>
      </header>

      <div className="layout">
        <section className="panel">
          <form onSubmit={handleSubmit}>
            <label htmlFor="mission-input">Mission input</label>
            <textarea
              id="mission-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              spellCheck={false}
              rows={12}
            />
            <p className="hint muted">
              Plateau size, then optional obstacle lines (<code>O x y</code>,
              starting with the letter O), then a position line and a commands
              line per rover.
            </p>
            <button type="submit" disabled={loading}>
              {loading ? "Running…" : "Run mission"}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {result && (
            <div className="output">
              <h2>Final positions</h2>
              <pre>{result.output || "No rovers"}</pre>
              <p className="muted">
                A trailing <code>O</code> (letter) marks a rover that stopped at
                an obstacle.
              </p>
            </div>
          )}
        </section>

        <section className="panel">
          {result ? (
            <>
              <div className="stats">
                <span>
                  <strong>{visitedCount}</strong> of {squares} squares visited
                </span>
                <span className="muted">
                  Step {playback.step} / {trail.length}
                </span>
              </div>

              <PlateauCanvas
                result={result}
                visits={visits}
                step={playback.step}
              />

              <div className="controls">
                <button
                  type="button"
                  onClick={playback.playing ? playback.pause : playback.play}
                >
                  {playback.playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={playback.restart}
                >
                  Restart
                </button>
                <input
                  type="range"
                  aria-label="Playback position"
                  min={0}
                  max={trail.length}
                  value={playback.step}
                  onChange={(event) =>
                    playback.seek(Number(event.target.value))
                  }
                />
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                >
                  {SPEEDS.map((value) => (
                    <option key={value} value={value}>
                      {value} steps/s
                    </option>
                  ))}
                </select>
              </div>

              <ul className="legend">
                <li>
                  <span className="swatch swatch-empty" /> Unexplored
                </li>
                <li>
                  <span className="swatch swatch-visited" /> Visited
                </li>
                <li>
                  <span className="swatch swatch-head" /> Latest move
                </li>
                <li>
                  <span className="swatch swatch-obstacle" /> Obstacle
                </li>
              </ul>
              <p className="muted">(0, 0) is bottom-left; north is up.</p>
            </>
          ) : (
            <p className="empty muted">Run a mission to see the plateau.</p>
          )}
        </section>
      </div>
    </main>
  );
}
