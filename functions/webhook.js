import getUserData from './utils/getUserData'
import oauth2, { config } from './utils/oauth'

/* Function to handle intercom auth callback */
exports.handler = (event, context, callback) => {
  console.log('event', event);
  console.log('query', event.queryStringParameters);
  console.log('body', event.body);
  //  console.log(event.queryStringParameters['hub.challenge']);
  const challenge = event.queryStringParameters['hub.challenge'];

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({"hub.challenge":challenge}),
    headers: {
      'Cache-Control': 'no-cache' // Disable caching of this response
    }
  });
}


