const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const { transcript } = JSON.parse(event.body);

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

    return { 
      statusCode: 200, 
      body: JSON.stringify({ notionPageUrl: response.url })
    };
  } catch (error) {
    console.error('Error exporting to Notion:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Export to Notion failed' })
    };
  }
};