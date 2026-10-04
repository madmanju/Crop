import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  generateAdvisoryHandler,
  getAdvisoriesHandler,
  getAdvisoryByIdHandler,
  deleteAdvisoryHandler,
} from '../controllers/advisoryController';

const router = Router();

// All advisory routes require authentication
router.use(authMiddleware);

// POST /api/advisories/generate
router.post('/generate', generateAdvisoryHandler);

// GET /api/advisories
router.get('/', getAdvisoriesHandler);

// GET /api/advisories/:id
router.get('/:id', getAdvisoryByIdHandler);

// DELETE /api/advisories/:id
router.delete('/:id', deleteAdvisoryHandler);

export default router;
