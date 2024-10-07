const { Configuration, OpenAIApi } = require('openai');
const formidable = require('formidable-serverless');
const fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(event, async (err, fields, files) => {
      if (err) {
        return resolve({ statusCode: 500, body: JSON.stringify({ error: 'Error parsing form data' }) });
      }

      const audioFile = files.audio;
      const context = fields.context;
      const systemPrompt = fields.systemPrompt;

      try {
        const transcription = await openai.createTranscription(
          fs.createReadStream(audioFile.path),
          "whisper-1",
          systemPrompt,
          'text',
          0.2,
          'zh'
        );

        resolve({ 
          statusCode: 200, 
          body: JSON.stringify({ transcript: transcription.data })
        });
      } catch (error) {
        console.error('Error during transcription:', error);
        resolve({ 
          statusCode: 500, 
          body: JSON.stringify({ error: 'Transcription failed' })
        });
      }
    });
  });
};