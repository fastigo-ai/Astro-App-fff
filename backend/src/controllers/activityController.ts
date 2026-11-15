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
            { id: '1', title: 'Vishnu Sahasranama', subtitle: 'Vishnu Sahasranama', scheduleText: '21 November, Saturday | 12:00 PM', time: '12:00 PM', type: 'Vedic Chanting', duration: '15 mins', completed: true, color: '#831843', iconName: 'PlayCircle' },
            { id: '2', title: 'Morning Yognidra', subtitle: 'Gentle Pranayama & Meditation', scheduleText: '22 November, Sunday | 07:30 AM', time: '07:30 AM', type: 'Yoga & Relaxation', duration: '20 mins', completed: true, color: '#0284C7', iconName: 'BookOpen' },
            { id: '3', title: 'Garbh Samvaad', subtitle: 'Loving Mother-Baby Bonding', scheduleText: '23 November, Monday | 04:30 PM', time: '04:30 PM', type: 'Bonding Talk', duration: '10 mins', completed: false, color: '#D97706', iconName: 'CheckCircle2' },
            { id: '4', title: 'Evening Ragas', subtitle: '432Hz Soothing Classical Melodies', scheduleText: '24 November, Tuesday | 07:00 PM', time: '07:00 PM', type: 'Music Therapy', duration: '30 mins', completed: false, color: '#7C3AED', iconName: 'Music' },
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
      
      const detailsMap: Record<string, any> = {
        '1': {
          id: '1',
          title: 'Vishnu Sahasranama',
          type: 'Vedic Chanting',
          duration: '15 mins',
          color: '#831843',
          iconName: 'PlayCircle',
          contentBlocks: [
            {
              type: 'text',
              text: 'Vishnu Sahasranama (1000 names of Lord Vishnu) produces sacred sound vibrations that stimulate fetal neural pathways, calms maternal blood pressure, and creates deep spiritual protection for the baby in the womb.'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop'
            },
            {
              type: 'steps',
              steps: [
                'Sit in a comfortable cross-legged posture with back straight.',
                'Place your hands gently over your womb (Garbha) with love.',
                'Close your eyes and chant or listen with sincere devotional focus.',
                'Feel the divine vibrations connecting your heart with your baby.'
              ]
            }
          ]
        },
        '2': {
          id: '2',
          title: 'Morning Yognidra',
          type: 'Yoga & Relaxation',
          duration: '20 mins',
          color: '#0284C7',
          iconName: 'BookOpen',
          contentBlocks: [
            {
              type: 'text',
              text: 'Gentle prenatal breathing (Anulom Vilom & Bhramari) combined with deep conscious rest (Yognidra) maximizes oxygen delivery to the placenta and eliminates pregnancy stress.'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop'
            },
            {
              type: 'steps',
              steps: [
                'Lie comfortably on your left side with pillow support.',
                'Inhale calm, peaceful energy through both nostrils.',
                'Practice 5 rounds of gentle Bhramari (humming bee breath).',
                'Release all physical tension as you drift into restorative Yognidra.'
              ]
            }
          ]
        },
        '3': {
          id: '3',
          title: 'Garbh Samvaad',
          type: 'Bonding Talk',
          duration: '10 mins',
          color: '#D97706',
          iconName: 'CheckCircle2',
          contentBlocks: [
            {
              type: 'text',
              text: 'Your baby can clearly recognize parents voices from the second trimester. Speaking positive affirmations directly shapes babys emotional security and intelligence.'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop'
            },
            {
              type: 'steps',
              steps: [
                'Find a calm moment together with your partner or by yourself.',
                'Gently stroke your belly in a clockwise circular motion.',
                'Speak directly to baby: You are healthy, calm, wise, and deeply loved.',
                'Pause and notice babys gentle movements or flutter kicks.'
              ]
            }
          ]
        },
        '4': {
          id: '4',
          title: 'Evening Ragas',
          type: 'Music Therapy',
          duration: '30 mins',
          color: '#7C3AED',
          iconName: 'Music',
          contentBlocks: [
            {
              type: 'text',
              text: 'Vedic classical ragas (Raag Yaman, Raag Bilawal, and Raag Bhairav) played at 432Hz promote alpha brain waves in the fetus, inducing sound sleep and emotional stability.'
            },
            {
              type: 'image',
              url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop'
            },
            {
              type: 'steps',
              steps: [
                'Dim the lights and set a peaceful ambience.',
                'Play the soothing raga at a comfortable, soft volume.',
                'Breathe in sync with the slow melodic rhythm.',
                'End the session with Gayatri Mantra recitation.'
              ]
            }
          ]
        }
      };

      const mockActivityDetail = detailsMap[id] || detailsMap['1'];

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
