import axios from "axios";

const baseURL = process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1";
const apiKey = process.env.AIML_API_KEY;
const model = process.env.MODEL_ID || "openai/gpt-5-chat-latest";

const client = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${apiKey}` }
});

// Minimal JSON schema the model should produce
// { "steps": [ { "id": 1, "action": "select_tool", "tool": "circle" }, ... ] }

export async function planSteps(instruction) {
  const system = [
    "You are CoachMode Planner.",
    "Input: a natural language drawing instruction.",
    "Output: STRICT JSON with shape/tool actions:",
    "Schema:",
    "{ \"steps\": [",
    "  {\"id\":1, \"action\":\"select_tool\", \"tool\":\"<circle|triangle|fill|delete|resize>\"},",
    "  {\"id\":2, \"action\":\"draw_shape\", \"shape\":\"<circle|triangle>\", \"position\":\"<center|inside-circle|...>\"},",
    "  {\"id\":3, \"action\":\"apply_style\", \"style\":\"<red|highlight|...>\"}",
    "]}",
    "Do not include explanations—return only JSON."
  ].join("\n");

  const body = {
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: instruction || "" }
    ]
  };

  const { data } = await client.post("/chat/completions", body);
  const content = data?.choices?.[0]?.message?.content || "{\"steps\":[]}";
  try { return JSON.parse(content).steps || []; } catch { return []; }
}
