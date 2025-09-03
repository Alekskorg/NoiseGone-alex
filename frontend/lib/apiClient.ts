// Клиент для взаимодействия с нашими API-роутами

export const apiClient = {
  separate: async (file: File): Promise<{ vocalUrl: string; instrumentalUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/separate', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to separate audio');
    }
    
    return response.json();
  },

  tts: async (text: string, voice: string = 'alloy'): Promise<Blob> => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate speech');
    }
    
    return response.blob();
  },
};
