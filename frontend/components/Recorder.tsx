import { Mic, StopCircle } from 'lucide-react';
import { useState, useRef } from 'react';

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
}

export const Recorder = ({ onRecordingComplete }: RecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Не удалось получить доступ к микрофону.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center gap-4">
      <h3 className="font-semibold">Запись с микрофона</h3>
      <div className="flex gap-4">
        {!isRecording ? (
          <button onClick={startRecording} className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600">
            <Mic size={24} />
          </button>
        ) : (
          <button onClick={stopRecording} className="p-4 rounded-full bg-gray-700 text-white hover:bg-gray-800">
            <StopCircle size={24} />
          </button>
        )}
      </div>
      {audioURL && (
        <div className="w-full">
            <h4 className="text-sm font-medium text-center mb-2">Предпросмотр записи</h4>
            <audio src={audioURL} controls className="w-full" />
        </div>
      )}
    </div>
  );
};
