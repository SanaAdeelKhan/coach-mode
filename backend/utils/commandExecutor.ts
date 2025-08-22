// utils/commandExecutor.ts
import { AgentStep } from "@shared/types";

/**
 * Executes a drawing command on the provided canvas context.
 * Works with Node canvas or browser canvas.
 */
export const executeCommand = (
  step: AgentStep,
  ctx: any // accept Node canvas or DOM canvas
): void => {
  if (!ctx) {
    console.error("Canvas context is not provided.");
    return;
  }

  switch (step.action) {
    case "draw_circle": {
      const { x, y, radius } = step.params ?? {};
      if (typeof x === "number" && typeof y === "number" && typeof radius === "number") {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        console.warn("Invalid parameters for draw_circle:", step.params);
      }
      break;
    }

    case "draw_square": {
      const { x, y, size } = step.params ?? {};
      if (typeof x === "number" && typeof y === "number" && typeof size === "number") {
        ctx.strokeRect(x, y, size, size);
      } else {
        console.warn("Invalid parameters for draw_square:", step.params);
      }
      break;
    }

    case "clear_canvas": {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      break;
    }

    default:
      console.warn("Unknown action:", step.action);
  }
};
