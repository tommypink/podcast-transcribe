import React from 'react';

interface SystemPromptProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

const SystemPrompt: React.FC<SystemPromptProps> = ({ systemPrompt, setSystemPrompt }) => {
  return (
    <div className="mb-4">
      <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700">
        系统提示词
      </label>
      <textarea
        id="system-prompt"
        rows={5}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
      ></textarea>
    </div>
  );
};

export default SystemPrompt;