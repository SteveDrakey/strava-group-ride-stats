import simpleOauth from 'simple-oauth2'

const intercomApi = 'https://www.strava.com/api/v3'; // '/v3/oauth/token'
/* process.env.URL from netlify BUILD environment variables */
const siteUrl = process.env.URL || 'http://localhost:3000'

export const config = {
  /* values set in terminal session or in netlify environment variables */
  // appId: process.env.INTERCOM_APP_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  testRefreshToken: 'a62c5fe83cdbac61f96989469d3618c2410b2e67',
  /* Intercom oauth API endpoints */
  tokenHost: intercomApi,
  authorizePath: `${intercomApi}/oauth`,
  tokenPath: `${intercomApi}/oauth/token`,
  profilePath: `${intercomApi}/me/`,
  /* redirect_uri is the callback url after successful signin */
  redirect_uri: `${siteUrl}/.netlify/functions/auth-callback`,
  searchKey: process.env.SEARCH_KEY
}

function authInstance(credentials) {
  if (!credentials.client.id) {
    throw new Error('MISSING REQUIRED ENV VARS. Please set INTERCOM_CLIENT_ID')
  }
  if (!credentials.client.secret) {
    throw new Error('MISSING REQUIRED ENV VARS. Please set INTERCOM_CLIENT_SECRET')
  }
  // return oauth instance
  return simpleOauth.create(credentials)
}

/* Create oauth2 instance to use in our two functions */
export default authInstance({
  client: {
    id: config.clientId,
    secret: config.clientSecret
  },
  auth: {
    tokenHost: config.tokenHost,
    tokenPath: config.tokenPath,
    authorizePath: config.authorizePath
  }
})
