import formidable from 'formidable-serverless';
import AWS from 'aws-sdk';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

export const handler = async (event, context) => {
  try {
    console.log("Transcribe function called");
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

          console.log("Transcription completed:", transcription);

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
  } catch (error) {
    console.error("Error in transcribe function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};