import getUserData from './utils/getUserData'
import querystring from 'querystring'
import oauth2, { config } from './utils/oauth'
import request from 'request'


/* Function to handle intercom auth callback */
exports.handler = (event, context, callback) => {

  console.log('WebHook');
  var data = JSON.parse(event.body);
  // {"aspect_type":"update"

  console.log('WebHook...', data.owner_id, data.aspect_type);

  if (data.owner_id != 6362236 || data.aspect_type != 'create' ) {
    console.log('ignored');
    return;
  }

  console.log('doing stuff');

  var code = config.testRefreshToken;

  const challenge = event.queryStringParameters['hub.challenge'];

  console.log('about to send postData');
  const postData = querystring.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: code,
    grant_type: 'refresh_token'
  });

  requestWrapper(null, postData).then((r) => {

    console.log('post data callback');

    var access_token = JSON.parse(r.data).access_token

    console.log('we have a token');

    // The segments are not always with us, so for a simple fix lets just sleep for 10 seconds
    setTimeout(() => {
      makeNiceName(access_token, data.object_id);
    }, 1000 * 5);

  }).catch(e => {
    console.log('e', e);
    return callback(null, {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message,
      })
    })
  })

  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({ "hub.challenge": challenge }),
    headers: {
      'Cache-Control': 'no-cache' // Disable caching of this response
    }
  });
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

function makeNiceName(token, activityId) {
  console.log('makeNiceName', activityId);
  var strava = require('strava-v3');
  strava.activities.get(
    { 'access_token': token, id: activityId },
    function (err, activity, limits) {
      let segmentNames = activity.segment_efforts.filter(f => f.segment.city && f.segment.city.length > 3).map(m => m.segment.city);
      for (const segment of segmentNames) {
        // console.log('seg', `${segment.segment.name}, ${segment.segment.city} ${segment.segment.start_latlng}`);
        console.log('seg', `${segment} : ${segment.replace(/(\b(\w{1,3})\b(\W|$))/g, '')} `);
      }
      segmentNames = segmentNames.map(m => m.replace(/(\b(\w{1,3})\b(\W|$))/g, '').trim());
      const sentence = joinSentence(byCount(segmentNames).slice(0, 3), false);

      //const update = { name: 'Riding around ' + coolName };

      strava.activities.update({ 'access_token': token, id: activityId, name: 'Riding around ' + sentence },
        function (err, done, limits) {
          console.log('updated ride name', err);
        }
      );
      console.log('sentence', sentence);
    });
}

function byCount(array) {
  const frequency = {};

  array.forEach((value) => { frequency[value] = 0; });

  const uniques = array.filter((value) => {
    return ++frequency[value] === 1;
  });

  console.log('uniques', uniques);
  console.log('frequency', frequency);
  return uniques.filter((f) => frequency[f] > 1).sort((a, b) => frequency[b] - frequency[a]);
}

function joinSentence(array, oxfordComma) {
  let lastWord;
  if (array.length > 1) {
    lastWord = ' and ' + array.pop();
    if (oxfordComma && array.length > 1) {
      lastWord = ',' + lastWord;
    }
  } else {
    lastWord = '';
  }
  return array.join(', ') + lastWord;
}