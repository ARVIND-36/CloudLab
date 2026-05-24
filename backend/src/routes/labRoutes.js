import { Router } from 'express';
import { create, list, remove } from '../controllers/labController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLabSchema } from '../schemas/labSchemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', list);
router.post('/create', validate(createLabSchema), create);
router.delete('/:id', remove);

export default router;