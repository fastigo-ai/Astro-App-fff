import { activityRepository } from './activity.repository';

export const activityService = {
  getDailyJourney() {
    return activityRepository.getDailyJourneyTemplate();
  },

  markDayComplete(day: number | string) {
    console.log(`[Backend] Marked Day ${day} as complete!`);
    return {
      message: 'Day marked as complete',
      newStreak: 6,
    };
  },

  getActivityDetail(id: string) {
    return activityRepository.getActivityDetailById(id);
  },

  adminCreateActivity(body: Record<string, any>) {
    return body;
  },
};

