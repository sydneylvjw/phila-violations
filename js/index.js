import { SlideDeck } from './slidedeck.js';

//building map layout
const map = L.map('map', {
  scrollWheelZoom: false
})
.setView(
  [39.9526, -75.1652], 
  14
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
  // let strawberryMansion = L.polygon => ([
  //           [39.985641, -75.187595],
  //           [39.993281, -75.186047],
  //           [39.998180, -75.187442],
  //           [39.995057, -75.163474],
  //           [39.987544, -75.178473]
  //         ]).addTo(null);



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
          return {
          color: 'black',
          fillOpacity: 0,
          weight: 3,
        };
      }},
      'fifth-slide': { 
        style: (_feature) => ({ 
        color: 'black',
        fillColor: 'whitesmoke', 
        fillOpacity: 1, 
        weight: 2, 
      }),
    },
      'sixth-slide': { 
        style: (_feature) => ({ 
        color: 'black',
        fillColor: 'whitesmoke',
        fillOpacity: 1, 
        weight: 2, 
      }),
    },
      'seventh-slide': {
        style: (_feature) => ({ 
          color: 'black',
          fillColor: 'whitesmoke',
          fillOpacity: 1, 
          weight: 2, 
      }),
      zoom: 10,
    },
       'eighth-slide': {

      }
  };

  // Create the SlideDeck and initialize
  const deck = new SlideDeck(container, slides, map, slideOptions);
  deck.preloadFeatureCollections();
  deck.syncMapToCurrentSlide();

  // Simple scroll handler: update current slide index and toggle overlay
  document.addEventListener('scroll', () => {
    deck.calcCurrentSlideIndex();
    toggleViolPerAddress();
  });

  // // Toggle the violPerAddress overlay for slides 4 and 5 (indices 3 and 4)
  // async function toggleViolPerAddress() {
  //   const idx = deck.currentSlideIndex;
  //   const shouldShow = idx === 3 || idx === 4;
  //   if (shouldShow) {
  //     try {
  //       const layer = await ensureViolPerAddress();
  //       if (!map.hasLayer(layer)) map.addLayer(layer);
  //       if (!violPerAddressAddedToControl) {
  //         overlaysControl.addOverlay(layer, 'Properties with the Most Violations Per Year');
  //         violPerAddressAddedToControl = true;
  //       }
  //     } catch (err) {
  //       console.error('Error loading violPerAddress layer:', err);
  //     }
  //   } else {
  //     if (violPerAddressLoaded && map.hasLayer(violPerAddressLayer)) {
  //       map.removeLayer(violPerAddressLayer);
  //     }
  //   }
  // }

  // // initial state
  // toggleViolPerAddress();

}
