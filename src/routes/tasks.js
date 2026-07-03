import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT id, title, done, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId]
  );
  res.json(result.rows);
});

tasksRouter.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Le titre est requis' });
  }

  const result = await pool.query(
    'INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, title, done, created_at',
    [req.userId, title.trim()]
  );
  res.status(201).json(result.rows[0]);
});

tasksRouter.patch('/:id', async (req, res) => {
  const { title, done } = req.body;
  const result = await pool.query(
    `UPDATE tasks SET title = COALESCE($1, title), done = COALESCE($2, done)
     WHERE id = $3 AND user_id = $4
     RETURNING id, title, done, created_at`,
    [title, done, req.params.id, req.userId]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Tâche introuvable' });
  }
  res.json(result.rows[0]);
});

tasksRouter.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [
    req.params.id,
    req.userId,
  ]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Tâche introuvable' });
  }
  res.status(204).send();
});
