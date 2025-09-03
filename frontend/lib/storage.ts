// MVP для истории на localStorage

const HISTORY_KEY = 'noiseGoneHistory';

export interface HistoryItem {
  id: string;
  type: 'ffmpeg' | 'rnnoise' | 'separate' | 'tts';
  date: string;
  outputUrl: string;
}

// Получить всю историю
export const getHistory = (): HistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const storedHistory = localStorage.getItem(HISTORY_KEY);
  return storedHistory ? JSON.parse(storedHistory) : [];
};

// Добавить запись в историю
export const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
  if (typeof window === 'undefined') return;
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  history.unshift(newItem); // Добавляем в начало
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20))); // Храним последние 20
};

// Очистить историю
export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
};
