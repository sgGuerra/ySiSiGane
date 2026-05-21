import { Router } from 'express';
import { getAllTickets, getRecentActivity, getStats } from '../../controllers/adminController';
import { authenticate, requireAdmin } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/tickets', getAllTickets);
router.get('/stats', getStats);
router.get('/recent-activity', getRecentActivity);

export default router;
