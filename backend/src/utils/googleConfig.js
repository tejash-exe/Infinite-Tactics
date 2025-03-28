import { google } from 'googleapis';
import 'dotenv/config';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

const oauth2client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
);

export default oauth2client;