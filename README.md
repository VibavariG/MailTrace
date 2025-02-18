# MailTrace
An application to parse emails 

## Environment Variables
Create a `.env` file in the root directory with the following structure:
  CLIENT_ID=your_google_client_id
  CLIENT_SECRET=your_google_client_secret
  REDIRECT_URI=http://localhost:3000/oauth2callback
  PORT=3000
  OPENAI_API_KEY=your_open_api_key

## Run
cd backend
python3 -m venv venv
source venv/bin/activate
node app.js
