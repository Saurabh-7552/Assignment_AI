import { Router } from 'express';
import * as controller from '../controllers/assignment.controller';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.get('/:id/pdf', controller.downloadPdf);
router.post('/:id/retry', controller.retry);
router.get('/:id', controller.getById);

export default router;
