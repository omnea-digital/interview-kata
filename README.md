# Mars rover mission simulator

NASA scientists are planning a mission to Mars. Their rovers will execute whatever instructions they receive. You’re building a simulator so the scientists can check what their rovers will do before sending instructions.

**Choose your language before the interview.** The exercise is language agnostic. We have starters for [TypeScript](https://github.com/omnea-digital/interview-kata/tree/main), [Python with venv and mypy](https://github.com/omnea-digital/interview-kata/tree/python), and [Python with uv, Ruff, and ty](https://github.com/omnea-digital/interview-kata/tree/python-astral). If you’d prefer another language, ask us ahead of time and we’ll do our best to accommodate you.

## Your brief

One of the scientists used AI to build the first version of the simulator, but they don't have a software engineering background.

Review the prototype and its code. If you were using it to plan a mission, what would you keep, and what would you change? You can build on what's there or rewrite any part of it.

During the pairing session, your interviewer will bring you new requests from the scientists and answer questions on their behalf. Bring your own ideas, too.

Decide what to tackle first and how much you can deliver in the time available. Aim to get the code as close to production quality as you can.

We encourage AI tools, but they're optional. You won't be assessed on whether you use them. However you work, you should understand the code you finish with and be able to explain how it works.

## How the prototype works

The first line of a mission plan gives the upper-right coordinates of a rectangular plateau. The lower-left corner is `0 0`. Each rover then gets two lines: its starting `x y heading` (where heading is `N`, `E`, `S` or `W`), followed by its commands. Rovers run in the order listed, each finishing before the next starts.

- `L` and `R` turn a rover 90° left or right in place.
- `M` moves it forward one grid point in the direction it faces. North increases `y` and east increases `x`.

For example, the scientists can enter this two-rover plan:

```text
5 5
1 2 N
LMLMLMLMM
3 3 E
MMRMMRMRRM
```

The simulator reports the final position and heading of each rover, in the same order:

```text
1 3 N
5 1 E
```

![Compass showing the four cardinal directions](./compass.png)

## Running this version

The simulator is in [index.py](./index.py) and the tests are in [index_test.py](./index_test.py). This starter uses typed Python with strict mypy checks.

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
mypy .
```
