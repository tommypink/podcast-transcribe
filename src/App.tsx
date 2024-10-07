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
  const [error, setError] = useState<string | null>(null);

  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('请先上传音频文件');
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('context', context);
      formData.append('systemPrompt', systemPrompt);

      const url = `${config.apiUrl}/transcribe`; // 移除 '/api'
      console.log('Sending request to:', url);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      if (data.error) {
        throw new Error(data.error);
      }

      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error during transcription:', error);
      setError(`转录失败，请重试。错误详情：${error instanceof Error ? error.message : String(error)}`);
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
      {error && <p className="text-red-500 mt-2">{error}</p>}
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