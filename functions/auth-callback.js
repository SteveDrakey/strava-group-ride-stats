import getUserData from './utils/getUserData'
import oauth2, { config } from './utils/oauth'

/* Function to handle intercom auth callback */
exports.handler = (event, context, callback) => {
  const code = event.queryStringParameters.code
  /* state helps mitigate CSRF attacks & Restore the previous state of your app */
  const state = event.queryStringParameters.state

  /* Take the grant code and exchange for an accessToken */
  oauth2.authorizationCode.getToken({
    code: code,
    redirect_uri: config.redirect_uri,
    client_id: config.clientId,
    client_secret: config.clientSecret
  })
    .then((result) => {
      const token = oauth2.accessToken.create(result)
      console.log('..accessToken', result)
      console.log('refresh_token token 2', result.refresh_token)
      // Do stuff with user data
      console.log('state', state)
      // return results to browser
      return callback(null, {
        statusCode: 302,
        headers: {
          Location: `/?refreshToken=${result.refresh_token}`,
          'Cache-Control': 'no-cache' // Disable caching of this response
        },
      })
    })
    .catch((error) => {
      console.log('Access Token Error', error.message)
      console.log(error)
      return callback(null, {
        statusCode: error.statusCode || 500,
        body: JSON.stringify({
          error: error.message,
        })
      })
    })
}
