import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TranscriptDisplayProps {
  transcript: string;
}

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcript }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">转录结果</h2>
      <div className="bg-white shadow-md rounded-lg p-6 prose prose-sm max-w-none">
        <ReactMarkdown>{transcript}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TranscriptDisplay;