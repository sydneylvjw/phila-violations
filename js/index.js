import { SlideDeck } from './slidedeck.js';

//building map layout
const map = L.map('map', {
  scrollWheelZoom: false
})
.setView(
  [39.9526, -75.1652], 
  13
);


// ## The Base Tile Layer
const Stadia_StamenTonerLite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
Stadia_StamenTonerLite.addTo(map);


// create control but add overlays later:
const overlaysControl = L.control.layers(null, null).addTo(map);


{
  // ## Interface Elements (simplified)
  const container = document.querySelector('.slide-section');
  const slides = document.querySelectorAll('.slide');




  // Keep your existing slideOptions (only styles/handlers are relevant to SlideDeck)
  // Each individual slide is styled below
  const slideOptions = {
      'title-slide': { style: (_feature) => 
        ({ 
        color: 'black', 
        fillOpacity: 0,
        weight: 3, 
      }),
      zoom: 12 
    },
      'second-slide': { style: (_feature) => ({
        color: 'black',
        fillOpacity: 0,
        weight: 3, 
      }), 
      zoom: 14,
    },
      'third-slide': {
        pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
          radius: 2,
          fillColor: '#802525',
          color: '#802525',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        }),
        style: (_feature) => {
          if (_feature && _feature.geometry && _feature.geometry.type === 'Point') {
            return {};
          }
          return {
          color: 'black',
          fillOpacity: 0,
          weight: 3,
        };
      },
      zoom: 14,
    },
      'fourth-slide': {         
        pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
          radius: 2,
          fillColor: '#802525',
          color: '#802525',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        }),
        style: (_feature) => {
          if (_feature && _feature.geometry && _feature.geometry.type === 'Point') {
            return {};
          }
          //Polygons around concentration of violations
          if (_feature&& _feature.properties && _feature.properties.area === 'west-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          if (_feature && _feature.properties && _feature.properties.area === 'north-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          return {
            color: 'black',
            fillOpacity: 0,
            weight: 3,
          };
        },
        bounds: [[39.90, -75.25], [40.08, -75.13]]
    },
      'fifth-slide': { 
        pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
          radius: 2,
          fillColor: '#802525',
          color: '#802525',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        }),
        style: (_feature) => {
          if (_feature && _feature.geometry && _feature.geometry.type === 'Point') {
            return {};
          }
          //Polygons around concentration of violations
          if (_feature&& _feature.properties && _feature.properties.area === 'west-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          if (_feature && _feature.properties && _feature.properties.area === 'north-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          return {
            color: 'black',
            fillOpacity: 0,
            weight: 3,
          };
        },
        bounds: [[39.90, -75.25], [40.08, -75.13]]
    },
      'sixth-slide': { 
        pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
          radius: 2,
          fillColor: '#802525',
          color: '#802525',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
        }),
        style: (_feature) => {
          if (_feature && _feature.geometry && _feature.geometry.type === 'Point') {
            return {};
          }
          //Polygons around concentration of violations
          if (_feature&& _feature.properties && _feature.properties.area === 'west-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          if (_feature && _feature.properties && _feature.properties.area === 'north-phila') {
            return {
              color: '#FF8C00',
              fillColor: '#FF8C00',
              fillOpacity: 0.2,
              weight: 2,
            };
          }
          return {
            color: 'black',
            fillOpacity: 0,
            weight: 3,
          };
        },
        bounds: [[39.90, -75.25], [40.08, -75.13]]
    },
    //   'seventh-slide': {
    //     style: (_feature) => ({ 
    //       color: 'black',
    //       fillColor: 'whitesmoke',
    //       fillOpacity: 1, 
    //       weight: 2, 
    //   }),
    //   zoom: 14,
    // },
    //    'eighth-slide': {

    //   }
  };

  // Create the SlideDeck and initialize
  const deck = new SlideDeck(container, slides, map, slideOptions);
  deck.preloadFeatureCollections();
  deck.syncMapToCurrentSlide();


  // adding scroll handlers
  document.addEventListener('scroll', () => {
  const img = document.querySelector('#fifth-slide-image');
  if (!img) return;

  const top = img.getBoundingClientRect().top;
  if (top <= 0) {
    img.classList.add('fixed');
  } else {
    img.classList.remove('fixed');
  }
});



    // Scroll-based handler for image transition
    document.addEventListener('scroll', () => {
      deck.calcCurrentSlideIndex();
      
      // const fifthImage = document.querySelector('#fifth-slide-image');
      // const fifthSlide = document.querySelector('#fifth-slide');

      // if (!fifthImage || !fifthSlide) return;

      // // get the positions of the fifth image
      // const imageRect = fifthImage.getBoundingClientRect();
      // const fifthSlideRect = fifthSlide.getBoundingClientRect();

      // // scroll in the image and then have it be fixed at 90vh for the rest
      // if (imageRect.top <= 0) {
      //   // or the image has scrolled to the top, fix it in position
      //  fifthImage.classList.add('fixed'); 
      // } else {
      //   //otherwise, if an image is still scrolling in, take away the fixed
      //   fifthImage.classList
      // }
      
      // if (!fifthImage) return;
      
      // // Show image when on slide 5 or beyond (indices 4, 5, 6...)
      // const inImageMode = deck.currentSlideIndex >= 4;
      
      // if (inImageMode) {
      //   fifthImage.classList.add('active');
      //   fifthImage.style.position = 'fixed';
      //   fifthImage.style.top = '0';
      //   fifthImage.style.left = '0';
      //   fifthImage.style.width = '100%';
      //   fifthImage.style.zIndex = '50';
      //   fifthImage.style.height = '60vh';
      // } else {
      //   fifthImage.classList.remove('active');
      //   fifthImage.style.position = 'relative';
      //   fifthImage.style.top = 'auto';
      //   fifthImage.style.zIndex = '50';
      // }
    });
  }