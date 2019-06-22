import request from 'request'
import querystring from 'querystring'

import  { config } from './utils/oauth'

/* Function to handle intercom auth callback */
exports.handler = (event, context, callback) => {
  const code = event.body;
  console.log('code', code)

  /* Take the grant code and exchange for an accessToken */
  const postData = querystring.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: code,
    grant_type: 'refresh_token'
  })
  
  console.log('postData', postData)

  requestWrapper(null, postData).then((r) => {
    console.log('returning', r);
    return callback(null, {
      statusCode: 200,
      body: r.data,
      headers: {
        'Cache-Control': 'no-cache' // Disable caching of this response
      },
    })
  }).catch(e => {
    console.log('e', e);
    return callback(null, {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message,
      })
    })
  })
}

function requestWrapper(requestOptions, data) {
  return new Promise((resolve, reject) => {

    request.post('https://www.strava.com/oauth/token', { form: data }, (err, response, body) => {
      //request(requestOptions, (err, response, body) => {
      if (err) {
        return reject(err)
      }
      // return data
      return resolve({
        data: body
      })
    })
  })
}

