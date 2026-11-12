import { bumpRepository } from './bump.repository';

export const bumpService = {
  getJourney() {
    return bumpRepository.getJourneyTimeline();
  },

  uploadBump(payload: { imageBase64: string; frameType?: string; month?: number; notes?: string }) {
    return bumpRepository.saveBumpEntry(payload);
  },
};

