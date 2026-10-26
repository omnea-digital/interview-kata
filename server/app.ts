import fs from "node:fs";
import path from "node:path";
import express from "express";
import { InputError } from "../index";
import type { ErrorResponse, SimulationResult } from "../shared/api";
import { simulate } from "./simulate";

const WEB_DIST = path.resolve(__dirname, "../dist/web");

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post(
    "/api/simulations",
    (req, res: express.Response<SimulationResult | ErrorResponse>) => {
      const input: unknown = req.body?.input;
      if (typeof input !== "string") {
        res
          .status(400)
          .json({
            error: 'Expected a JSON body of the form { "input": "..." }',
          });
        return;
      }

      try {
        res.json(simulate(input));
      } catch (error) {
        if (!(error instanceof InputError)) throw error;
        res.status(400).json({ error: error.message });
      }
    },
  );

  // In production the server also hosts the built frontend; in development Vite serves it instead.
  if (fs.existsSync(WEB_DIST)) {
    app.use(express.static(WEB_DIST));
  }

  // Answer in JSON rather than Express's default HTML page, e.g. when the body isn't valid JSON.
  app.use(
    (
      error: { status?: number; expose?: boolean; message?: string },
      _req: express.Request,
      res: express.Response<ErrorResponse>,
      _next: express.NextFunction,
    ) => {
      const status =
        error.status && error.status >= 400 && error.status < 500
          ? error.status
          : 500;
      if (status === 500) console.error(error);
      res
        .status(status)
        .json({
          error: error.expose ? String(error.message) : "Internal server error",
        });
    },
  );

  return app;
}
