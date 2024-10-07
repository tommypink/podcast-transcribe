import React from 'react';

interface ContextInputProps {
  context: string;
  setContext: (context: string) => void;
}

const ContextInput: React.FC<ContextInputProps> = ({ context, setContext }) => {
  return (
    <div className="mb-4">
      <label htmlFor="context" className="block text-sm font-medium text-gray-700">
        上下文信息
      </label>
      <textarea
        id="context"
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        placeholder="请输入与音频相关的上下文信息..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
      ></textarea>
    </div>
  );
};

export default ContextInput;