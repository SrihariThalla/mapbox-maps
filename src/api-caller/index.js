import wdk from 'wikidata-sdk';
import osmtogeojson from 'osmtogeojson';
import querystring from 'querystring';
import request from 'request';
import JSONStream from '@sriharithalla/jsonstream';

const apiCaller = (store) => (next) => (action) => { // eslint-disable-line

  switch (action.type) {
  // ---------------------------------------------------------------------------
  case 'GET_ROUTE': {
    // Dispatch pending action
    next({
      type: 'SET_STATE_VALUE',
      key: 'routeStatus',
      value: 'pending'
    });

    const baseUrl = 'https://api.mapbox.com/directions/v5/mapbox/';

    let profile = 'driving-traffic';
    if (action.modality === 'car') profile = 'driving-traffic';
    if (action.modality === 'bike') profile = 'cycling';
    if (action.modality === 'walk') profile = 'walking';

    const fromCoordinates = action.directionsFrom.geometry.coordinates.join(',');
    const toCoordinates = action.directionsTo.geometry.coordinates.join(',');

    const url = baseUrl + profile + '/' + fromCoordinates + ';' + toCoordinates
      + '?access_token=' + action.accessToken
      + '&overview=full';

    // Fetch
    fetch(url, {method: 'get'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else { // 4xx or 5xx response
          var err = new Error(res.statusText);
          next({
            type: 'SET_STATE_VALUE',
            key: 'routeStatus',
            value: 'error'
          });
          return Promise.reject(err);
        }
      })
      .then(data => {
        if (data.code !== 'Ok') Promise.reject();
        else {
          // Success
          next({
            type: 'SET_ROUTE',
            data: data
          });
          next({
            type: 'SET_STATE_VALUE',
            key: 'routeStatus',
            value: 'idle'
          });
          next({
            type: 'TRIGGER_MAP_UPDATE',
            needMapRepan: true
          });
        }
      })
      .catch(() => next({
        type: 'SET_STATE_VALUE',
        key: 'routeStatus',
        value: 'error'
      }));
    break;
  }

  case 'GET_PLACE_INFO': {
    const url = wdk.getEntities({
      ids: action.id,
      languages: ['en'],
    });

    fetch(url, {method: 'get'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else { // 4xx or 5xx response
          var err = new Error(res.statusText);
          return Promise.reject(err);
        }
      })
      .then(data => {
        // Success
        const entity = data.entities[action.id];
        const simplifiedClaims = wdk.simplifyClaims(entity.claims);
        const description = entity.descriptions.en.value;
        const label = entity.labels.en.value;
        next({
          type: 'SET_STATE_VALUE',
          key: 'placeInfo',
          value: {
            claims: simplifiedClaims,
            description,
            label
          }
        });
      })
      .catch(() => {});
    break;
  }

  case 'GET_REVERSE_GEOCODE': {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
      + action.coordinates.join(',') + '.json'
      + '?access_token=' + action.accessToken;

    fetch(url, {method: 'get'})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else { // 4xx or 5xx response
          var err = new Error(res.statusText);
          return Promise.reject(err);
        }
      })
      .then(data => {
        // Success
        if (data.features && data.features.length > 0) {
          next({
            'type': 'SET_STATE_VALUE',
            'key': action.key,
            'value': {
              'place_name': data.features[0].place_name,
              'geometry': {
                'type': 'Point',
                'coordinates': action.coordinates
              }
            }
          });
        } else Promise.reject();
      })
      .catch(() => {
        next({
          'type': 'SET_STATE_VALUE',
          'key': action.key,
          'value': {
            'place_name': 'Dropped pin',
            'geometry': {
              'type': 'Point',
              'coordinates': action.coordinates
            }
          }
        });
      });
    break;
  }

  case 'GET_OVERPASS_DATA': {
    const url = 'http://overpass-api.de/api/interpreter';
    let reqOptions = {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: querystring.stringify({
        data: action.query
      })
    };
    let options = action.options || {};

    let r = request.post(url, reqOptions);

    r
      .on('response', (response) => {
        if (response.statusCode !== 200) {
          r.abort();
          Promise.reject(new Error(response.statusCode));
        }
      })
      .pipe(JSONStream.parse())
      .on('data', (data) => {
        let geojson;

        geojson = osmtogeojson(data, {
          flatProperties: options.flatProperties || false
        });

        next({
          'type': 'SET_OVERPASS_DATA',
          'overpassData': geojson,
        });
        next({
          type: 'TRIGGER_MAP_UPDATE',
          needMapRepan: true
        });
      })
      .on('error', () => {
        Promise.reject();
      });

    break;
  }

  default:
    next(action); // let through as default
    break;
  }
};

export default apiCaller;
