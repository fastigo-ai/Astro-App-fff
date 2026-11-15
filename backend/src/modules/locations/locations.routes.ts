import { Router } from 'express';
import { locationsController } from './locations.controller';

const router = Router();

// GET /states (e.g. /api/locations/states)
router.get('/states', locationsController.getStates);

// GET /cities/:stateCode (e.g. /api/locations/cities/MH)
router.get('/cities/:stateCode', locationsController.getCities);

export default router;

