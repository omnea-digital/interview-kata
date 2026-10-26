# THE MARS ROVER KATA

> **Versions of this kata**
>
> - **TypeScript** — you are here
> - [Python with `mypy`/`venv`](https://github.com/omnea-digital/interview-kata/tree/python)
> - [Python with `uv`/`ruff`/`ty`](https://github.com/omnea-digital/interview-kata/tree/python-astral)

A squad of robotic rovers are to be landed by NASA on a plateau on Mars. This plateau, which is
curiously rectangular, must be navigated by the rovers so that their on-board cameras can get a
complete view of the surrounding terrain to send back to Earth.

A rover's position and location is represented by a combination of x and y coordinates and a letter
representing one of the four cardinal compass points. The plateau is divided up into a grid to simplify
navigation. An example position might be 0, 0, N, which means the rover is in the bottom left corner
and facing North.

In order to control a rover, NASA sends a simple string of letters. The possible letters are `L`, `R` and
`M`. `L` and `R` makes the rover spin 90 degrees left or right respectively, without moving from its
current spot. `M` means move forward one grid point, and maintain the same heading.
Assume that the square directly North from (x, y) is (x, y+1).

### INPUT

The first line of input is the upper-right coordinates of the plateau, the lower-left coordinates are
assumed to be 0,0.

The rest of the input is information pertaining to the rovers that have been deployed. Each rover has
two lines of input. The first line gives the rover's position, and the second line is a series of
instructions telling the rover how to explore the plateau. The position is made up of two integers
and a letter separated by spaces, corresponding to the x and y coordinates and the rover's
orientation.

Each rover will be finished sequentially, which means that the second rover won`t start to move until
the first one has finished moving.

### OUTPUT

The output for each rover should be its final coordinates and heading.

### EXAMPLE

Test Input:

```
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```

Expected Output:

```
1 3 N
5 1 E
```

![](./compass.png)

### SOLUTION

A solution to this problem has been implemented in `index.ts`. In the interview, we'll improve and extend this implementation.

### OBSTACLES

Obstacles can be listed between the plateau line and the first rover, one per line, as the letter `O`
followed by coordinates:

```
5 5
O 1 3
1 2 N
MRM
```

A rover that would move onto an obstacle stays where it is, skips its remaining commands and reports a
trailing `O`, e.g. `1 2 N O`.

### WEB APP

The mission can be run from a browser, which replays the rovers' moves and shades every square of the
plateau that has been visited.

```
index.ts          domain: Rover, Plateau, MarsRoverMission (records the trail of squares entered)
shared/api.ts     request/response types shared by server and client
server/           Express API: POST /api/simulations { "input": "..." }
web/              React + Vite client
```

- `npm install`
- `npm run dev` starts the API on port 3001 and the client on http://localhost:5173
- `npm run build && npm start` serves the built client and API together on http://localhost:3001
- `npm test` runs the Jest suites in watch mode; `npm run typecheck` checks the server and client
