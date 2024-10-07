import OpenAI from 'openai';
import dotenv from 'dotenv';
import busboy from 'busboy';
import fs from 'fs';
import os from 'os';
import path from 'path';

dotenv.config();

console.log("Environment variables:");
console.log("OPENAI_API_KEY set:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handler = async (event, context) => {
  console.log("Transcribe function called");
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // 检查 Content-Type
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  
  if (contentType && contentType.includes('application/json')) {
    // 处理 JSON 数据
    try {
      const { audio, context, systemPrompt } = JSON.parse(event.body);
      // 将 base64 音频数据写入临时文件
      const audioFilePath = path.join(os.tmpdir(), `${Date.now()}-audio.mp3`);
      fs.writeFileSync(audioFilePath, Buffer.from(audio, 'base64'));

      console.log('Starting transcription...');
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1",
        response_format: 'text',
        temperature: 0.2,
        language: 'zh'
      });

      console.log("Transcription completed:", transcription);

      // 清理临时文件
      fs.unlinkSync(audioFilePath);

      return { 
        statusCode: 200, 
        body: JSON.stringify({ transcript: transcription })
      };
    } catch (error) {
      console.error('Error during transcription:', error);
      return { 
        statusCode: 500, 
        body: JSON.stringify({ 
          error: 'Transcription failed', 
          details: error.message,
          stack: error.stack
        })
      };
    }
  } else {
    // 处理 multipart/form-data
    return new Promise((resolve, reject) => {
      const bb = busboy({ headers: event.headers });
      const fields = {};
      const fileWrites = [];
      let audioFilePath;

      bb.on('file', (name, file, info) => {
        const saveTo = path.join(os.tmpdir(), `${Date.now()}-${info.filename}`);
        audioFilePath = saveTo;
        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);

        const promise = new Promise((resolve, reject) => {
          file.on('end', () => writeStream.end());
          writeStream.on('finish', resolve);
          writeStream.on('error', reject);
        });
        fileWrites.push(promise);
      });

      bb.on('field', (name, val) => {
        fields[name] = val;
      });

      bb.on('finish', async () => {
        await Promise.all(fileWrites);

        try {
          console.log('Starting transcription...');
          const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: "whisper-1",
            response_format: 'text',
            temperature: 0.2,
            language: 'zh'
          });

          console.log("Transcription completed:", transcription);

          // 清理临时文件
          fs.unlinkSync(audioFilePath);

          resolve({ 
            statusCode: 200, 
            body: JSON.stringify({ transcript: transcription })
          });
        } catch (error) {
          console.error('Error during transcription:', error);
          resolve({ 
            statusCode: 500, 
            body: JSON.stringify({ 
              error: 'Transcription failed', 
              details: error.message,
              stack: error.stack
            })
          });
        }
      });

      bb.end(Buffer.from(event.body, 'base64'));
    });
  }
};