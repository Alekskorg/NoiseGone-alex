import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { getHistory, clearHistory, HistoryItem } from '../lib/storage';
import { Player } from '../components/Player';

const HistoryPage: NextPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">История обработок</h1>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Очистить историю
          </button>
        )}
      </header>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">Ваша история пуста.</p>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <div key={item.id} className="p-4 bg-white rounded-lg shadow-md">
                <p><strong>Тип:</strong> {item.type}</p>
                <p><strong>Дата:</strong> {new Date(item.date).toLocaleString()}</p>
                <Player src={item.outputUrl} fileName={`history_${item.id}.mp3`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
