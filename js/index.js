import { SlideDeck } from './slidedeck.js';

const map = L.map('map', {
  scrollWheelZoom: false
})
.setView(
  [39.9526, -75.1652], 
  13
);

// ## The Base Tile Layer
const stadiaAlidadeSmoothDark = L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png',
});
stadiaAlidadeSmoothDark.addTo(map);


 {
      // ## Interface Elements
      const container = document.querySelector('.slide-section');
      const slides = document.querySelectorAll('.slide');

      // ## Creating the object slideOptions, the bundle of variables and functions, to pass to slidedeck.js
      const slideOptions = {
        'title-slide': {
          style: (feature) => ({
            color: 'lightgray',
            fillColor: 'black',
            fillOpacity: 1,
            weight: 2,
          }),
          zoom: 12,
        },
        'second-slide': {
          style: (feature) => ({
            color: 'lightgray',
            fillColor: 'black',
            fillOpacity: 1,
            weight: 2,
          }),
          zoom: 14,
        },
        'third-slide': {
          style: (feature) => ({
            color: 'lightgray',
            fillColor: 'darkred',
            fillOpacity: 1,
            weight: 2,
          }),
          onEachFeature: (feature, layer) => {
            layer.bindTooltip(feature.properties.label);
          },
        },
        'fourth-slide': {
          style: (feature) => ({
            color: 'blue',
            fillColor: 'yellow',
            fillOpacity: 0.5,
          }),
          zoom: 15
        },
      }; // here is where slideOptions object ends


      // ## The SlideDeck object
      const deck = new SlideDeck(container, slides, map, slideOptions);

      document.addEventListener('scroll', () => deck.calcCurrentSlideIndex());

      deck.preloadFeatureCollections();
      deck.syncMapToCurrentSlide();
    };
