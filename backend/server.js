import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow your Vite frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'CoachMode Backend is running ✅' });
});

// Agent endpoint that the frontend calls
app.post('/api/agent', (req, res) => {
  const { instruction } = req.body ?? {};

  // Return a "steps" array so the frontend can safely .map(...)
  const steps = [
    { action: 'acknowledge', tool: 'system', note: 'received instruction' },
    { action: `execute: ${instruction ?? 'no instruction'}`, tool: 'canvas', shape: 'circle' },
  ];

  res.json({ steps });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
