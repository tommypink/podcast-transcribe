import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import config from '../config';

interface NotionExportProps {
  transcript: string;
}

const NotionExport: React.FC<NotionExportProps> = ({ transcript }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch(`${config.apiUrl}/api/export-to-notion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error('Export to Notion failed');
      }

      const data = await response.json();
      alert(`转录内容已成功导出到 Notion！\n页面 URL: ${data.notionPageUrl}`);
    } catch (error) {
      console.error('Error exporting to Notion:', error);
      alert('导出到 Notion 失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        onClick={handleExport}
        disabled={isExporting}
      >
        <FileText className="mr-2" />
        {isExporting ? '导出中...' : '导出到 Notion'}
      </button>
    </div>
  );
};

export default NotionExport;