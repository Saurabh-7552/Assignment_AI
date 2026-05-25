import { Router } from 'express';
import assignmentRoutes from './assignment.routes';

const router = Router();

router.use('/assignments', assignmentRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default router;
