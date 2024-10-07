import { Client } from "@notionhq/client";
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export const handler = async (event, context) => {
  console.log("Export to Notion function called");
  console.log("Event:", JSON.stringify(event, null, 2));

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let transcript;
  try {
    ({ transcript } = JSON.parse(event.body));
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  if (!transcript) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Transcript is required' })
    };
  }

  console.log("Notion API Key set:", !!process.env.NOTION_API_KEY);
  console.log("Notion Database ID:", process.env.NOTION_DATABASE_ID);

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'Podcast Transcript',
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: transcript,
                },
              },
            ],
          },
        },
      ],
    });

    console.log("Notion page created successfully:", response.url);

    return { 
      statusCode: 200, 
      body: JSON.stringify({ notionPageUrl: response.url })
    };
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Export to Notion failed', details: error.message })
    };
  }
};