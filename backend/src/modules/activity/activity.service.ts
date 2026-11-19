import {
  DailyActivitiesCollection,
  DailyCareNotesCollection,
  IDailyActivityRecord,
  IDailyCareNoteRecord,
} from '../../shared/db/dbStore';
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

  getDailySchedule(month: number, day: number): IDailyActivityRecord {
    const m = Number(month) || 4;
    const d = Number(day) || 1;
    const all = DailyActivitiesCollection.read();
    const found = all.find((item) => Number(item.month) === m && Number(item.day) === d);

    if (found) return found;

    return {
      id: `act_m${m}_d${d}`,
      month: m,
      day: d,
      mantraTitle: `Day ${d} Vedic Shloka & Chanting`,
      mantraText: 'ॐ नमो भगवते वासुदेवाय॥',
      mantraAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89013e896.mp3',
      samvadTopic: `Day ${d} Womb Talk: Gratitude & Love`,
      samvadAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2492161f52.mp3',
      gameType: 'Brain Game',
      gameTitle: `Day ${d} Cognitive Stimulation Challenge`,
      yogaPose: 'Tadasana & Gentle Breathwork',
      yogaVideoUrl: 'https://www.youtube.com/watch?v=sample1',
      dietTip: 'High-fiber seasonal fruits & iron-rich spinach soup.',
      bedtimeRaaga: 'Raag Bageshri Classical Lullaby',
      updatedAt: new Date().toISOString(),
    };
  },

  async saveDailySchedule(body: Partial<IDailyActivityRecord> & { month: number; day: number }) {
    const m = Number(body.month);
    const d = Number(body.day);
    const id = `act_m${m}_d${d}`;

    const record: IDailyActivityRecord = {
      id,
      month: m,
      day: d,
      mantraTitle: body.mantraTitle || `Day ${d} Shloka`,
      mantraText: body.mantraText || 'ॐ नमो भगवते वासुदेवाय॥',
      mantraAudioUrl: body.mantraAudioUrl,
      samvadTopic: body.samvadTopic || `Day ${d} Samvad`,
      samvadAudioUrl: body.samvadAudioUrl,
      gameType: body.gameType || 'Brain Game',
      gameTitle: body.gameTitle || `Day ${d} Game`,
      yogaPose: body.yogaPose || 'Yoga',
      yogaVideoUrl: body.yogaVideoUrl,
      dietTip: body.dietTip || 'Diet',
      bedtimeRaaga: body.bedtimeRaaga,
      updatedAt: new Date().toISOString(),
    };

    return DailyActivitiesCollection.upsert({ month: m, day: d }, record);
  },

  getCareNotes(month: number, day: number): IDailyCareNoteRecord {
    const m = Number(month) || 4;
    const d = Number(day) || 1;
    const all = DailyCareNotesCollection.read();
    const found = all.find((item) => Number(item.month) === m && Number(item.day) === d);

    if (found) return found;

    return {
      id: `care_m${m}_d${d}`,
      month: m,
      day: d,
      dos: '• Sleep in left-lateral position for optimal uterine circulation.\n• Stay well hydrated with lukewarm water.\n• Listen to calming classical music.',
      donts: '• Avoid heavy lifting.\n• Avoid spicy and oily deep-fried foods.\n• Avoid stressful media and late nights.',
      fatherDuties: '• Read the daily Garbh Samvad aloud to baby at night.\n• Offer gentle foot massage to relieve fatigue.\n• Ensure plenty of rest and cheerful companionship.',
      medicalAdvice: '• Track daily baby movements.\n• Maintain balanced diet rich in leafy greens and protein.',
      hydrationLiters: 2.8,
      updatedAt: new Date().toISOString(),
    };
  },

  async saveCareNotes(body: Partial<IDailyCareNoteRecord> & { month: number; day: number }) {
    const m = Number(body.month);
    const d = Number(body.day);
    const id = `care_m${m}_d${d}`;

    const record: IDailyCareNoteRecord = {
      id,
      month: m,
      day: d,
      dos: body.dos || '',
      donts: body.donts || '',
      fatherDuties: body.fatherDuties || '',
      medicalAdvice: body.medicalAdvice || '',
      hydrationLiters: Number(body.hydrationLiters) || 2.5,
      updatedAt: new Date().toISOString(),
    };

    return DailyCareNotesCollection.upsert({ month: m, day: d }, record);
  },
};

