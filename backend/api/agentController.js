import { planSteps } from "../services/agentService.js";

export async function handleAgentInstruction(req, res) {
  try {
    const { instruction, sessionId = "default" } = req.body || {};
    const steps = await planSteps(instruction);

    // You could also append to transcript service here
    res.json({ sessionId, steps });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Agent planning failed" });
  }
}
