import { useState, useEffect } from 'react';
import { DropzoneUploader } from '../components/DropzoneUploader';
import { NoiseActions, ActionType } from '../components/NoiseActions';
import { Player } from '../components/Player';
import { useFfmpegNoise, ProcessingMode } from '../hooks/useFfmpegNoise';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  
  const { load: loadFfmpeg, processAudio, isLoading, progress, isReady } = useFfmpegNoise();

  useEffect(() => {
    loadFfmpeg();
  }, []);

  const handleFileAccepted = (file: File) => {
    setInputFile(file);
    setOutputUrl(null);
    setOriginalUrl(URL.createObjectURL(file));
  };

  const handleAction = async (action: ActionType) => {
    if (!inputFile) {
      alert("Пожалуйста, сначала загрузите файл.");
      return;
    }

    if (action === 'separate' || action === 'tts') {
        alert(`Функционал "${action}" требует подключения бэкенда.`);
        return;
    }
    
    const resultUrl = await processAudio(inputFile, action as ProcessingMode);
    if (resultUrl) {
      setOutputUrl(resultUrl);
    }
  };

  const reset = () => {
    setInputFile(null);
    setOutputUrl(null);
    setOriginalUrl(null);
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <header className="text-center my-8">
        <h1 className="text-4xl sm:text-5xl font-bold">NoiseGone</h1>
        <p className="text-lg text-gray-600 mt-2">Очистите ваш звук от шума в несколько кликов</p>
      </header>

      <main className="space-y-8">
        {!inputFile && (
          <DropzoneUploader onFileAccepted={handleFileAccepted} disabled={!isReady || isLoading} />
        )}
        
        {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                    className="bg-violet-600 h-4 rounded-full transition-all" 
                    style={{ width: `${progress}%` }}
                ></div>
                <p className="text-center text-sm mt-2">{progress}%</p>
            </div>
        )}

        {inputFile && !outputUrl && !isLoading && (
            <NoiseActions onActionSelect={handleAction} disabled={isLoading || !isReady} />
        )}

        {outputUrl && (
          <div>
            <Player 
                src={outputUrl} 
                originalSrc={originalUrl ?? undefined} 
                fileName={`processed_${inputFile?.name}`} 
            />
            <div className="text-center mt-4">
                <button onClick={reset} className="text-violet-600 hover:underline">
                    Обработать другой файл
                </button>
            </div>
          </div>
        )}

        {!isReady && !isLoading && <p className="text-center">Загрузка ffmpeg.wasm...</p>}
      </main>
    </div>
  );
};

export default Home;
