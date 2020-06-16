import request from 'request'
import querystring from 'querystring'

import  { config } from './utils/oauth'

/* Function to handle intercom auth callback */
exports.handler = (event, context, callback) => {
  

  console.log('index');

  const {
    SearchClient,
    SearchIndexClient,
    SearchIndexerClient,
    AzureKeyCredential 
  } = require("@azure/search-documents");

  const client = new SearchClient(
    'https://search-strava.search.windows.net',
    'activities',
    new AzureKeyCredential(config.searchKey)
  );


  var data = JSON.parse(event.body);
  console.log(data.id);
  console.log(data.token);


  var strava = require('strava-v3');

  strava.activities.get(
    { 'access_token': data.token, id: data.id },
    function (err, activity, limits) {

      console.log(err);
      console.log('Current name', activity.name);
      console.log('Current desc', activity.description);

      const name = activity.name;
      const description = activity.description;
      const segments = activity.segment_efforts.map(m => m.name);
      const cities = activity.segment_efforts.map(m => m.segment.city).filter( f=> f);
  
      const docs = [{
        id: activity.id.toString(),
        title: name || '',
        description : description || '',
        segments: segments.filter(onlyUnique) ,
        cities: cities.filter(onlyUnique) ,
        when: activity.start_date.toString(),
        athlete: activity.athlete.id.toString()
      }];

      console.log(docs);
      client.uploadDocuments(docs).then( (t) => console.log('t',t));
    });


  return callback(null, {
    statusCode: 200,
    body: '',
    headers: {
      'Cache-Control': 'no-cache' // Disable caching of this response
    }});
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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}