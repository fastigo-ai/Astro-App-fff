import { Request, Response, NextFunction } from 'express';

export const activityController = {
  getDailyJourney: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In production, this would fetch from MongoDB using the user's ID
      // const userId = req.user.id;
      // const journey = await UserJourney.findOne({ user_id: userId });
      // Calculate current day, generate activities based on current week, etc.

      // Returning mock structured data for now
      return res.status(200).json({
        success: true,
        data: {
          selectedDay: 28,
          streak: 5,
          days: [
            { day: 26, label: 'Mon', status: 'completed' },
            { day: 27, label: 'Tue', status: 'completed' },
            { day: 28, label: 'Wed', status: 'today' },
            { day: 29, label: 'Thu', status: 'locked' },
            { day: 30, label: 'Fri', status: 'locked' },
          ],
          activities: [
            { id: '1', title: 'Morning Yognidra', type: 'Yoga', duration: '15 mins', completed: true, color: '#EC4899', iconName: 'PlayCircle' },
            { id: '2', title: 'Brainopedia Session', type: 'Learning', duration: '20 mins', completed: true, color: '#3B82F6', iconName: 'BookOpen' },
            { id: '3', title: 'Garbh Samvaad', type: 'Bonding', duration: '10 mins', completed: false, color: '#F59E0B', iconName: 'CheckCircle2' },
            { id: '4', title: 'Evening Ragas', type: 'Music', duration: '30 mins', completed: false, color: '#8B5CF6', iconName: 'Music' },
          ]
        },
      });
    } catch (error) {
      next(error);
    }
  },

  markDayComplete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { day } = req.body;
      console.log(`[Backend] Marked Day ${day} as complete!`);
      
      return res.status(200).json({
        success: true,
        data: {
          message: 'Day marked as complete',
          newStreak: 6
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // GET detailed activity content by ID (For the App)
  getActivityDetail: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // In production, we would fetch from Activity.findById(id)
      // For now, we mock the dynamic content that the admin would have created
      
      const mockActivityDetail = {
        id,
        title: id === '1' ? 'Morning Yognidra' : 'Brainopedia Session',
        type: id === '1' ? 'Yoga' : 'Learning',
        duration: id === '1' ? '15 mins' : '20 mins',
        color: id === '1' ? '#EC4899' : '#3B82F6',
        iconName: id === '1' ? 'PlayCircle' : 'BookOpen',
        contentBlocks: [
          {
            type: 'text',
            text: 'Welcome to your daily session. Find a quiet, comfortable space where you will not be disturbed for the next few minutes.'
          },
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop'
          },
          {
            type: 'steps',
            steps: [
              'Lie down on your back in a comfortable position.',
              'Close your eyes and take a deep breath in.',
              'Exhale slowly, releasing all tension from your body.',
              'Follow along with the audio/video guide.'
            ]
          }
        ]
      };

      return res.status(200).json({
        success: true,
        data: mockActivityDetail
      });
    } catch (error) {
      next(error);
    }
  },

  // POST create a new activity (For the Admin Panel)
  adminCreateActivity: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In production:
      // const newActivity = await Activity.create(req.body);
      // return res.status(201).json({ success: true, data: newActivity });
      
      return res.status(201).json({
        success: true,
        message: 'Activity created successfully via Admin panel',
        data: req.body
      });
    } catch (error) {
      next(error);
    }
  }
};
