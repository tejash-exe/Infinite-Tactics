import { google } from 'googleapis';
import 'dotenv/config';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const oauth2client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'postmessage',
);

export default oauth2client;