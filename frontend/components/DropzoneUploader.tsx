import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface DropzoneUploaderProps {
  onFileAccepted: (file: File) => void;
  disabled: boolean;
}

export const DropzoneUploader = ({ onFileAccepted, disabled }: DropzoneUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      alert("Error: File is too large or not a valid audio file.");
      return;
    }
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.ogg', '.flac', '.m4a'] },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-violet-600 bg-violet-50' : 'border-gray-300'}
        ${disabled ? 'cursor-not-allowed bg-gray-100' : 'hover:border-violet-400'}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
      {isDragActive ? (
        <p className="text-violet-600">Отпустите файл для загрузки</p>
      ) : (
        <p className="text-gray-600">Перетащите файл сюда или кликните для выбора</p>
      )}
      <p className="text-sm text-gray-400 mt-2">MP3, WAV, FLAC, M4A (до 100MB)</p>
    </div>
  );
};
