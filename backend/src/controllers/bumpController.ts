import { Request, Response, NextFunction } from 'express';

export const bumpController = {
  // GET /api/v1/bump/journey
  getJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In production, fetch from BabyBump model filtering by req.user.id
      // const journey = await BabyBump.find({ userId: req.user.id }).sort({ month: 1 });
      
      // Mock Data for the beautiful timeline
      const mockJourney = [
        {
          _id: '1',
          imageUrl: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=600&auto=format&fit=crop',
          month: 3,
          frameType: 'floral',
          notes: 'First flutter!',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        },
        {
          _id: '2',
          imageUrl: 'https://images.unsplash.com/photo-1607582496733-47021e8e2dcb?q=80&w=600&auto=format&fit=crop',
          month: 5,
          frameType: 'minimal',
          notes: 'Growing so fast ❤️',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      ];

      return res.status(200).json({
        success: true,
        data: mockJourney
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/v1/bump/upload
  uploadBump: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { imageBase64, frameType, month, notes } = req.body;
      
      // In production:
      // 1. Upload imageBase64 to Cloudinary
      // const cloudinaryRes = await cloudinary.uploader.upload(imageBase64, { folder: 'baby_bumps' });
      // 2. Save to DB
      // const newBump = await BabyBump.create({ userId: req.user.id, imageUrl: cloudinaryRes.secure_url, month, frameType, notes });

      // Mock response simulating a successful cloudinary upload
      // Now that we have a real camera, we just echo back the base64 string to the frontend 
      // to display immediately! (In production this would be the secure_url)
      return res.status(201).json({
        success: true,
        message: 'Baby bump photo saved successfully',
        data: {
          _id: Date.now().toString(),
          imageUrl: imageBase64, // Use the real photo taken by the user!
          month,
          frameType,
          notes,
          createdAt: new Date()
        }
      });
    } catch (error) {
      next(error);
    }
  }
};
