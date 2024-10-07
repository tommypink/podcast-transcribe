import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body;

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

    res.status(200).json({ notionPageUrl: response.url });
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    res.status(500).json({ error: 'Export to Notion failed' });
  }
}