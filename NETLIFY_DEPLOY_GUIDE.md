# Deploying Your Podcast Transcription App to Netlify

Follow these steps to deploy your application to Netlify:

1. **Create a Netlify Account**
   - Go to https://www.netlify.com/
   - Click on "Sign up" and follow the instructions to create an account

2. **Connect Your Repository**
   - After logging in, click on "New site from Git"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select the repository containing your podcast transcription app

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Click on "Deploy site"**

5. **Set Up Environment Variables**
   - After the initial deploy, go to your site's dashboard
   - Click on "Site settings" in the top navigation menu
   - In the left sidebar, under "Build & deploy", click on "Environment"
   - Click on "Edit variables"
   - Add the following environment variables:
     - Key: `OPENAI_API_KEY`, Value: Your OpenAI API key
     - Key: `NOTION_API_KEY`, Value: Your Notion API key
     - Key: `NOTION_DATABASE_ID`, Value: Your Notion database ID

6. **Trigger a New Deploy**
   - Go to the "Deploys" tab
   - Click on "Trigger deploy" to start a new build with the updated environment variables

Your podcast transcription app should now be deployed and accessible via the Netlify URL provided!

Note: Make sure to keep your API keys and sensitive information secure. Never commit these directly to your repository.