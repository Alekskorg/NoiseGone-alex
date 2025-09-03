import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { useState, useRef } from 'react';

// Определяем типы для режимов обработки
export type ProcessingMode = 'speech' | 'music' | 'podcast' | 'enhance-voice' | 'normalize';

export const useFfmpegNoise = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Загрузка ffmpeg.wasm
  const load = async () => {
    setIsLoading(true);
    const ffmpeg = ffmpegRef.current;
    const baseURL = '[https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm](https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm)';
    
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    setIsLoading(false);
    setIsReady(true);
  };

  const processAudio = async (file: File, mode: ProcessingMode): Promise<string | null> => {
    if (!isReady) {
      console.error("FFmpeg is not loaded yet.");
      return null;
    }
    
    setIsLoading(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    const inputFileName = `input_${file.name}`;
    const outputFileName = `output_${file.name}`;

    await ffmpeg.writeFile(inputFileName, await fetchFile(file));

    let command: string[] = [];
    
    switch (mode) {
      case 'speech':
        command = ['-i', inputFileName, '-af', 'afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11', outputFileName];
        break;
      case 'music':
        command = ['-i', inputFileName, '-af', 'loudnorm=I=-23:TP=-1.5:LRA=7', outputFileName];
        break;
      case 'podcast':
        command = ['-i', inputFileName, '-af', 'afftdn=nf=-20,acompressor=threshold=-21dB:ratio=4:1:attack=20:release=250', outputFileName];
        break;
      case 'enhance-voice':
        command = ['-i', inputFileName, '-af', 'equalizer=f=1000:width_type=h:width=200:g=3,equalizer=f=3000:width_type=h:width=400:g=1.5', outputFileName];
        break;
      case 'normalize':
        command = ['-i', inputFileName, '-af', 'loudnorm', outputFileName];
        break;
      default:
        console.error("Unknown processing mode");
        setIsLoading(false);
        return null;
    }

    await ffmpeg.exec(command);

    const data = await ffmpeg.readFile(outputFileName);
    const blob = new Blob([data], { type: file.type });
    const url = URL.createObjectURL(blob);
    
    await ffmpeg.deleteFile(inputFileName);
    await ffmpeg.deleteFile(outputFileName);

    setIsLoading(false);
    return url;
  };

  return { load, processAudio, isLoading, progress, isReady };
};
