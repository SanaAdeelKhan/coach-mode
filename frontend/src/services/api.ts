import { API_BASE_URL } from "../config";
import type { AgentStep } from "../../../shared/types";

// Strongly typed: backend returns { steps: AgentStep[] }
export async function sendAgentInstruction(
  instruction: string,
  sessionId: string = "dev-session"
): Promise<{ steps: AgentStep[] }> {
  const res = await fetch(`${API_BASE_URL}/api/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instruction, sessionId }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<{ steps: AgentStep[] }>;
}
