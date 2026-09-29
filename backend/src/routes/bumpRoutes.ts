import { Router } from 'express';
import { bumpController } from '../controllers/bumpController';

const router = Router();

router.get('/journey', bumpController.getJourney);
router.post('/upload', bumpController.uploadBump);

export default router;
