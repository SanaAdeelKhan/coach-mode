import { Router } from "express";
import * as agentController from "./agentController.js";
import * as transcriptController from "./transcriptController.js";
import * as exportController from "./exportController.js";

const r = Router();

r.post("/agent", agentController.handleAgentInstruction);
r.post("/transcript/append", transcriptController.appendStep);
r.get("/transcript/:sessionId", transcriptController.getTranscript);
r.post("/export", exportController.exportTranscript);

export default r;
