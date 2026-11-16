import { Request, Response, NextFunction } from 'express';
import { locationsService } from './locations.service';

export const locationsController = {
  getStates: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryCode = (req.query.country as string) || 'IN';
      const states = await locationsService.getStates(countryCode);
      return res.status(200).json(states);
    } catch (error) {
      next(error);
    }
  },

  getCities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stateCode } = req.params;
      if (!stateCode) {
        return res.status(400).json({ error: 'State code is required' });
      }

      const countryCode = (req.query.country as string) || 'IN';
      const cities = await locationsService.getCities(String(stateCode), countryCode);
      return res.status(200).json(cities);
    } catch (error) {
      next(error);
    }
  },
};
