import { Configuration, OpenAIApi } from 'openai';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
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

      res.status(200).json({ transcript: transcription.data });
    } catch (error) {
      console.error('Error during transcription:', error);
      res.status(500).json({ error: 'Transcription failed' });
    }
  });
}