import polyline from '@mapbox/polyline';

const defaultState = {
  // Mapbox Access Token
  mapboxAccessToken: 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2l3ZmNjNXVzMDAzZzJ0cDV6b2lkOG9odSJ9.eep6sUoBS0eMN4thZUWpyQ',
  // Map
  mapCenter: [-122.4, 37.8],
  mapZoom: 10,
  mapStyle: 'streets',
  // Mode
  mode: 'search',
  modality: 'car',
  // Search
  searchString: '',
  searchLocation: null,
  needMapUpdate: false,
  needMapRepan: false,
  needMapRestyle: false,
  placeInfo: null,
  // User
  userLocation: null,
  // Directions
  directionsFromString: '',
  directionsFrom: null,
  directionsToString: '',
  directionsTo: null,
  route: null,
  routeStatus: 'idle',
  lastQueried: 0
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {

  case 'SET_STATE_VALUE': {
    const modifiedState = {};
    modifiedState[action.key] = action.value;
    return Object.assign({}, state, modifiedState);
  }

  case 'TRIGGER_MAP_UPDATE':
    return Object.assign({}, state, {
      needMapUpdate: true,
      needMapRepan: action.needMapRepan
    });

  case 'SET_USER_LOCATION':
    return Object.assign({}, state, {
      userLocation: {
        'place_name': 'My Location',
        center: action.coordinates,
        geometry: {
          type: 'Point',
          coordinates: action.coordinates
        }
      },
    });

  case 'SET_DIRECTIONS_LOCATION': {
    if (action.kind === 'from') {
      return Object.assign({}, state, {
        directionsFrom: action.location
      });
    } else if (action.kind === 'to') {
      return Object.assign({}, state, {
        directionsTo: action.location
      });
    } else return state;
  }

  case 'SET_ROUTE': {
    if (action.data.routes.length > 0 && state.directionsFrom && state.directionsTo) {
      const route = action.data.routes[0];

      const geojsonLine = polyline.toGeoJSON(route.geometry);
      route.geometry = geojsonLine;

      return Object.assign({}, state, {
        route: route
      });
    } else {
      return Object.assign({}, state, {
        routeStatus: 'error'
      });
    }
  }

  default:
    return state;
  }
};

export default reducer;
export {reducer, defaultState};
