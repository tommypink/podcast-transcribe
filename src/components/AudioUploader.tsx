import React, { useState, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface AudioUploaderProps {
  onFileUpload: (file: File) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload }) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="audio-upload" className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span className="flex items-center space-x-2">
          <Upload className="w-6 h-6 text-gray-600" />
          <span className="font-medium text-gray-600">
            {fileName ? fileName : "选择音频文件或拖放到这里"}
          </span>
        </span>
        <input
          id="audio-upload"
          type="file"
          className="hidden"
          accept="audio/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default AudioUploader;