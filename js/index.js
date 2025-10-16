import { SlideDeck } from './slidedeck.js';

const map = L.map('map', {scrollWheelZoom: false}).setView([39.9526, -75.1652], 12);

// ## The Base Tile Layer
const stadiaAlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png',
});
stadiaAlidadeSmoothDark.addTo(map);

fetch('../data/Political_Wards.geojson')
    .then((response) => response.json())
    .then((PoliticalWards) => {
      const filters = [
        {
          property: 'ward_num',
          value: [
            '3', '6', '11', '12', '14', '16', '18', '19', '20', '22', '24', '27', '28', '29', '32', '36', '37', '43', '44', '46', '47', '49', '51', '59', '60', '1', '2', '39A', '39B', '5', '25', '31', '45',
          ],
        },
      ];
      const filteredWards = PoliticalWards.features.filter((feature) => {
        const filter = filters[0];
        return filter.value.includes(feature.properties[filter.property]);
      });
      const filteredWardsGeoJSON = {
        ...PoliticalWards,
        features: filteredWards,
      };

      // ## Interface Elements
      const container = document.querySelector('.slide-section');
      const slides = document.querySelectorAll('.slide');

      const slideOptions = {
        'title-slide': {
          style: (feature) => ({
            color: 'lightgray',
            fillColor: 'black',
            fillOpacity: 1,
            weight: 2,
          }),
        },
        'second-slide': {
          style: (feature) => ({
            color: 'lightgray',
            fillColor: 'black',
            fillOpacity: 1,
            weight: 2,
          }),
          geojson: filteredWardsGeoJSON,
          zoom: 14,
        },
        'third-slide': {
          style: (feature) => ({
            color: 'red',
            fillColor: 'green',
            fillOpacity: 0.5,
          }),
        },
        'fourth-slide': {
          style: (feature) => ({
            color: 'blue',
            fillColor: 'yellow',
            fillOpacity: 0.5,
          }),
        },
      };


      // ## The SlideDeck object
      const deck = new SlideDeck(container, slides, map, slideOptions);

      document.addEventListener('scroll', () => deck.calcCurrentSlideIndex());

      deck.preloadFeatureCollections();
      deck.syncMapToCurrentSlide();
    });
