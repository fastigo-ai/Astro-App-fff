import { Router } from 'express';
import { supportController } from './support.controller';

const router = Router();

router.post('/tickets', supportController.createTicket);
router.get('/tickets', supportController.getUserTickets);
router.get('/tickets/:id', supportController.getTicketById);
router.post('/tickets/:id/reply', supportController.addUserReply);

export default router;

