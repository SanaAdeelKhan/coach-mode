// utils/commandExecutor.test.ts
import { createCanvas, Canvas, CanvasRenderingContext2D } from "canvas";
import { executeCommand } from "./commandExecutor.js";
import { AgentStep } from "@shared/types";

// Create a Node canvas (500x500)
const canvas: Canvas = createCanvas(500, 500);
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

// Sample agent steps
const steps: AgentStep[] = [
  { action: "draw_circle", params: { x: 50, y: 50, radius: 25 } },
  { action: "draw_square", params: { x: 100, y: 100, size: 40 } },
  { action: "clear_canvas" },
];

// Execute each step
steps.forEach((step) => executeCommand(step, ctx));

console.log("All commands executed successfully.");

// Optional: export canvas to a PNG to verify visually
import fs from "fs";
const out = fs.createWriteStream("test_output.png");
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on("finish", () => console.log("Canvas saved to test_output.png"));
