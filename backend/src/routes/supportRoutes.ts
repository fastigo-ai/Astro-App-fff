import { Router } from 'express';
import { supportController } from '../controllers/supportController';

const router = Router();

// User Support Chat Endpoints
router.post('/tickets', supportController.createTicket);
router.get('/tickets', supportController.getUserTickets);
router.get('/tickets/:id', supportController.getTicketById);
router.post('/tickets/:id/reply', supportController.addUserReply);

export default router;
