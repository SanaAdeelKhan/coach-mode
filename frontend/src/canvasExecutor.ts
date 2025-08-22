// frontend/src/canvasExecutor.ts
import type { AgentStep } from "../../shared/types";

/**
 * Draw a shape on canvas based on AgentStep
 */
export function executeCommand(step: AgentStep, ctx: CanvasRenderingContext2D) {
  if (!ctx) return;

  let { action, params } = step;

  // Normalize free-text actions to structured ones
  if (action === "execute: Draw a circle" || action === "draw a black circle") {
    action = "draw_circle";
    params = { x: params?.x ?? 100, y: params?.y ?? 100, radius: params?.radius ?? 50, color: params?.color ?? "black" };
  } else if (action === "execute: Draw a square") {
    action = "draw_square";
    params = { x: params?.x ?? 100, y: params?.y ?? 100, size: params?.size ?? 50, color: params?.color ?? "black" };
  } else if (action === "acknowledge") {
    console.log("Acknowledged!");
    return;
  }

  switch (action) {
    case "draw_circle": {
      const { x, y, radius, color } = params ?? {};
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof radius === "number"
      ) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = color ?? "black";
        ctx.stroke();
      }
      break;
    }

    case "draw_square": {
      const { x, y, size, color } = params ?? {};
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        typeof size === "number"
      ) {
        ctx.fillStyle = color ?? "black";
        ctx.fillRect(x, y, size, size);
      }
      break;
    }

    case "clear_canvas":
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;

    default:
      console.warn("Unknown action:", action);
  }
}

/**
 * Run multiple AgentSteps sequentially
 */
export function runAgentSteps(steps: AgentStep[], ctx: CanvasRenderingContext2D) {
  steps.forEach((step) => executeCommand(step, ctx));
}

/**
 * Enable interactive drawing on canvas
 * Returns the generated AgentSteps (for transcript)
 */
export function enableInteractiveDrawing(
  canvas: HTMLCanvasElement,
  shape: "circle" | "square",
  color: string,
  onStepGenerated: (step: AgentStep) => void
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let startX = 0;
  let startY = 0;
  let drawing = false;

  const mouseDown = (e: MouseEvent) => {
    drawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
  };

  const mouseMove = (e: MouseEvent) => {
    if (!drawing || !ctx) return;
    // Optional: live preview
  };

  const mouseUp = (e: MouseEvent) => {
    if (!drawing || !ctx) return;
    drawing = false;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    let step: AgentStep;

    if (shape === "circle") {
      const radius = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
      step = {
        action: "draw_circle",
        params: { x: startX, y: startY, radius, color },
      };
    } else {
      const size = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
      step = {
        action: "draw_square",
        params: { x: startX, y: startY, size, color },
      };
    }

    executeCommand(step, ctx);
    onStepGenerated(step); // Add to transcript
  };

  canvas.addEventListener("mousedown", mouseDown);
  canvas.addEventListener("mousemove", mouseMove);
  canvas.addEventListener("mouseup", mouseUp);

  // Return a cleanup function to remove listeners
  return () => {
    canvas.removeEventListener("mousedown", mouseDown);
    canvas.removeEventListener("mousemove", mouseMove);
    canvas.removeEventListener("mouseup", mouseUp);
  };
}
