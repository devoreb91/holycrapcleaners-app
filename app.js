const { Loader } = require('@googlemaps/js-api-loader');

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9axfPLt0DlFk6pRqYrXE-qZPCDDF4bck';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['geometry', 'drawing'],
});

loader.load().then(() => {
  console.log('Google Maps API loaded successfully!');
});
