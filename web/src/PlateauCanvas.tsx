import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { SimulationResult } from "../../shared/api";
import { visitedBy, type Visit } from "./playback";

interface Props {
  result: SimulationResult;
  visits: Visit[];
  step: number;
}

const MIN_CELL_FOR_GRID_LINES = 6;

// Canvas rather than DOM cells so large plateaus stay cheap to render.
export function PlateauCanvas({ result, visits, step }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const { maxX, maxY } = result.plateau;
  const cols = maxX + 1;
  const rows = maxY + 1;
  const visited = useMemo(() => visitedBy(visits, step), [visits, step]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0) return;

    const draw = () => {
      const cell = Math.min(width / cols, (window.innerHeight * 0.7) / rows);
      const cssWidth = cell * cols;
      const cssHeight = cell * rows;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const style = getComputedStyle(canvas);
      const color = (name: string) => style.getPropertyValue(name).trim();
      const size = Math.max(cell, 1);
      // North is up: plateau y grows upwards, canvas y grows downwards.
      const fillCell = (x: number, y: number) =>
        ctx.fillRect(x * cell, (maxY - y) * cell, size, size);

      ctx.fillStyle = color("--plateau-empty");
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      ctx.fillStyle = color("--plateau-visited");
      for (const { x, y } of visited) fillCell(x, y);

      ctx.fillStyle = color("--plateau-obstacle");
      for (const { x, y } of result.obstacles) fillCell(x, y);

      if (step > 0) {
        const head = result.trail[step - 1];
        ctx.fillStyle = color("--plateau-head");
        fillCell(head.x, head.y);
      }

      if (cell >= MIN_CELL_FOR_GRID_LINES) {
        ctx.strokeStyle = color("--plateau-grid");
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let col = 0; col <= cols; col++) {
          const x = Math.min(Math.round(col * cell), cssWidth - 1) + 0.5;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, cssHeight);
        }
        for (let row = 0; row <= rows; row++) {
          const y = Math.min(Math.round(row * cell), cssHeight - 1) + 0.5;
          ctx.moveTo(0, y);
          ctx.lineTo(cssWidth, y);
        }
        ctx.stroke();
      }
    };

    draw();
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    scheme.addEventListener("change", draw);
    return () => scheme.removeEventListener("change", draw);
  }, [width, cols, rows, maxY, visited, result, step]);

  return (
    <div ref={wrapperRef} className="plateau">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Plateau of ${cols} by ${rows} squares, ${visited.length} visited`}
      />
    </div>
  );
}
