import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import ContextInput from './components/ContextInput';
import SystemPrompt from './components/SystemPrompt';
import TranscriptDisplay from './components/TranscriptDisplay';
import NotionExport from './components/NotionExport';
import { FileAudio } from 'lucide-react';
import config from './config';

function App() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [context, setContext] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleTranscribe = async () => {
    if (!audioFile) {
      alert('请先上传音频文件');
      return;
    }

    setIsTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('context', context);
      formData.append('systemPrompt', systemPrompt);

      const response = await fetch(`${config.apiUrl}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error during transcription:', error);
      alert('转录失败，请重试');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FileAudio className="mr-2" />
        播客转录应用
      </h1>
      <AudioUploader onFileUpload={setAudioFile} />
      <ContextInput context={context} setContext={setContext} />
      <SystemPrompt systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleTranscribe}
        disabled={isTranscribing}
      >
        {isTranscribing ? '转录中...' : '开始转录'}
      </button>
      {transcript && (
        <>
          <TranscriptDisplay transcript={transcript} />
          <NotionExport transcript={transcript} />
        </>
      )}
    </div>
  );
}

export default App;