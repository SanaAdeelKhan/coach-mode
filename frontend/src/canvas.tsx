// frontend/src/canvas.tsx
import { useEffect, useRef, useState } from "react";
import type { AgentStep, UIAgentStep } from "../../shared/types"; // adjust relative path
import { executeCommand, enableInteractiveDrawing } from "./canvasExecutor"; // adjust path

interface CanvasProps {
  steps: UIAgentStep[];
  onStepGenerated: (step: UIAgentStep) => void;
}

export default function Canvas({ steps, onStepGenerated }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedShape, setSelectedShape] = useState<"circle" | "square">("circle");
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  // Render all steps whenever steps array changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas before redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all steps
    steps.forEach((step) => executeCommand(step, ctx));
  }, [steps]);

  // Enable interactive drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = enableInteractiveDrawing(
      canvas,
      selectedShape,
      selectedColor,
      (step) => {
        // Convert AgentStep to UIAgentStep for transcript
        const uiStep: UIAgentStep = {
          ...step,
          id: steps.length + 1,
          t: new Date().toLocaleTimeString(),
        };
        onStepGenerated(uiStep);
      }
    );

    return cleanup; // remove listeners on unmount or re-render
  }, [selectedShape, selectedColor, steps, onStepGenerated]);

  return (
    <div className="space-y-3">
      {/* Shape & Color Controls */}
      <div className="flex gap-2 items-center mb-2">
        <label className="flex items-center gap-1">
          <span>Shape:</span>
          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value as "circle" | "square")}
            className="border rounded px-2 py-1"
          >
            <option value="circle">Circle</option>
            <option value="square">Square</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span>Color:</span>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-10 h-10 border rounded"
          />
        </label>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="h-64 w-full rounded-2xl border border-dashed cursor-crosshair"
      />
    </div>
  );
}
