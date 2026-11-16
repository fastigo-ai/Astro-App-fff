import { ActivityTrackingCollection, IActivityTrackingRecord } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';
import { IActivity } from './activity.model';

export class ActivityRepository extends BaseRepository<IActivityTrackingRecord> {
  constructor() {
    super(ActivityTrackingCollection);
  }

  getDailyJourneyTemplate() {
    return {
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
      ],
    };
  }

  getActivityDetailById(id: string): IActivity {
    return {
      id,
      title: id === '1' ? 'Morning Yognidra' : 'Brainopedia Session',
      type: id === '1' ? 'Yoga' : 'Learning',
      duration: id === '1' ? '15 mins' : '20 mins',
      color: id === '1' ? '#EC4899' : '#3B82F6',
      iconName: id === '1' ? 'PlayCircle' : 'BookOpen',
      contentBlocks: [
        {
          type: 'text',
          text: 'Welcome to your daily session. Find a quiet, comfortable space where you will not be disturbed for the next few minutes.',
        },
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
        },
        {
          type: 'steps',
          steps: [
            'Lie down on your back in a comfortable position.',
            'Close your eyes and take a deep breath in.',
            'Exhale slowly, releasing all tension from your body.',
            'Follow along with the audio/video guide.',
          ],
        },
      ],
    };
  }
}

export const activityRepository = new ActivityRepository();

