interface TranscriptionFormProps {
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTranscript: (transcript: string) => void;
  audioFile: File | null;
  context: string;
  systemPrompt: string;
}

const TranscriptionForm: React.FC<TranscriptionFormProps> = ({
  setIsLoading,
  setError,
  setTranscript,
  audioFile,
  context,
  systemPrompt
}) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
      
        if (!audioFile) {
          setError('请选择音频文件');
          setIsLoading(false);
          return;
        }
      
        try {
          const formData = new FormData();
          formData.append('audio', audioFile);
          formData.append('context', context);
          formData.append('systemPrompt', systemPrompt);
      
          console.log('Sending transcription request...');
          const url = '/.netlify/functions/transcribe';
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
        } catch (error: unknown) {
          console.error('Error:', error);
          setError(`转录失败，请重试。错误详情：${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
};

export default TranscriptionForm;