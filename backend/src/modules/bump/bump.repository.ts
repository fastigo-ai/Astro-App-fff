export class BumpRepository {
  getJourneyTimeline() {
    return [
      {
        _id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=600&auto=format&fit=crop',
        month: 3,
        frameType: 'floral',
        notes: 'First flutter!',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
      {
        _id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1607582496733-47021e8e2dcb?q=80&w=600&auto=format&fit=crop',
        month: 5,
        frameType: 'minimal',
        notes: 'Growing so fast ❤️',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  saveBumpEntry(payload: { imageBase64: string; frameType?: string; month?: number; notes?: string }) {
    return {
      _id: Date.now().toString(),
      imageUrl: payload.imageBase64,
      month: payload.month,
      frameType: payload.frameType,
      notes: payload.notes,
      createdAt: new Date(),
    };
  }
}

export const bumpRepository = new BumpRepository();

