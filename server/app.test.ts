import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { createApp } from "./app";

describe("POST /api/simulations", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    server = createApp().listen(0);
    await new Promise((resolve) => server.once("listening", resolve));
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  const post = (body: unknown) =>
    fetch(`${baseUrl}/api/simulations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  it("should return the plateau, trail and final rover states", async () => {
    const response = await post({ input: "2 2\nO 1 2\n0 0 N\nMMRM\n2 0 W\nM" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      plateau: { maxX: 2, maxY: 2 },
      obstacles: [{ x: 1, y: 2 }],
      trail: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
      ],
      rovers: [
        { x: 0, y: 2, direction: "E", blocked: true },
        { x: 1, y: 0, direction: "W", blocked: false },
      ],
      output: "0 2 E O\n1 0 W",
    });
  });

  it("should reject malformed mission input with the parser's message", async () => {
    const response = await post({ input: "5 5\n1 2 Q\nM" });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Invalid rover position: "1 2 Q"',
    });
  });

  it.each([[{}], [{ input: 42 }], [null]])(
    "should reject a body without a string input: %p",
    async (body) => {
      const response = await post(body);

      expect(response.status).toBe(400);
      expect(await response.json()).toHaveProperty("error");
    },
  );
});
