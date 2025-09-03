import { Download, Play, Pause } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface PlayerProps {
  src: string;
  originalSrc?: string;
  fileName: string;
}

export const Player = ({ src, originalSrc, fileName }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
    }
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h3 className="font-semibold text-lg mb-4 text-center">Результат</h3>
      <audio ref={audioRef} src={src} className="hidden" onEnded={() => setIsPlaying(false)} />

      <div className="flex items-center gap-4">
        <button onClick={togglePlayPause} className="p-3 rounded-full bg-violet-600 text-white hover:bg-violet-700">
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <div className="w-full">
            <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
            <input 
                type="range" 
                value={currentTime} 
                max={duration || 0}
                onChange={(e) => {
                    if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </div>
      
      <div className="mt-6 flex justify-center gap-4">
        <a
          href={src}
          download={fileName}
          className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Download size={20} />
          Скачать результат
        </a>
        {originalSrc && (
            <button 
                onClick={() => {
                    if(audioRef.current) audioRef.current.src = (audioRef.current.src === src ? originalSrc : src);
                    if(isPlaying) audioRef.current.play();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
                До/После
            </button>
        )}
      </div>
    </div>
  );
};
