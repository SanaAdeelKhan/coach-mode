// frontend/src/types.ts

// Shape coming from API
export type AgentStep = {
  action: string;               // matches what your UI expects
  tool?: string;
  shape?: string;
  params?: Record<string, any>; // flexible key/value bag
};

// Extended shape stored in frontend state
export type UIAgentStep = AgentStep & {
  id: number;
  t: string; // timestamp
};
