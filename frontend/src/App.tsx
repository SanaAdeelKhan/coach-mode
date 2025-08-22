// frontend/src/App.tsx
import { useState } from "react";
import { sendAgentInstruction } from "./services/api";
import type { AgentStep, UIAgentStep } from "../../shared/types";
import Canvas from "./canvas"; // make sure your file is src/canvas.tsx

function TranscriptPanel({ steps }: { steps: UIAgentStep[] }) {
  return (
    <div className="space-y-2 max-h-64 overflow-auto border rounded-lg p-2">
      {steps.map((s) => (
        <div key={s.id} className="p-2 rounded-lg border">
          <div className="text-sm font-medium">
            Step {s.id}: {s.action}
          </div>
          <div className="text-xs opacity-70">{s.t}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<UIAgentStep[]>([]);

  async function sendInstruction() {
    if (!input.trim()) return;

    try {
      const data = await sendAgentInstruction(input);
      const apiSteps: AgentStep[] = Array.isArray(data?.steps) ? data.steps : [];

      setSteps((prev) => [
        ...prev,
        ...apiSteps.map((a, i) => ({
          ...a,
          id: prev.length + i + 1,
          t: new Date().toLocaleTimeString(),
        })),
      ]);

      setInput("");
    } catch (err) {
      console.error("API request failed:", err);
      setSteps((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          action: "Request failed",
          t: new Date().toLocaleTimeString(),
          params: {},
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">CoachMode — Single Agent MVP</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Canvas steps={steps} />
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-xl px-3 py-2"
              placeholder='Try: "Draw a circle in the center".'
            />
            <button onClick={sendInstruction} className="px-4 py-2 rounded-xl border">
              Send
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Transcript</h2>
          <TranscriptPanel steps={steps} />
        </div>
      </div>
    </div>
  );
}
