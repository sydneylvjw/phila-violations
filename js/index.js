import { SlideDeck } from './slidedeck.js';

//building map layout
const map = L.map('map', {
  scrollWheelZoom: false
})
.setView(
  [39.9526, -75.1652], 
  13
);

// Lazy-load the violPerAddress layer on demand for slides 4 and 5.
let violPerAddressLayer = null;
let violPerAddressLoaded = false;
async function ensureViolPerAddress() {
  if (violPerAddressLoaded) return violPerAddressLayer;
  const path = 'data/violPerAddress.geojson';
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();

  // keep raw data available if other code expects it
  window.violAddressYear = data;
  violPerAddressLayer = L.geoJSON(data);
  violPerAddressLoaded = true;
  return violPerAddressLayer;
}

// Lazy-load the violResolutionCode layer on demand for slides 4 and 5.
let violResolutionCodeLayer = null;
let violResolutionCodeLoaded = false;
async function ensureViolResolutionCode() {
  if (violResolutionCodeLoaded) return violResolutionCodeLayer;
  const path = 'data/violResolutionCode.geojson';
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();

  // keep raw data available if other code expects it
  window.violResolutionCodeLayer = data;
  violResolutionCodeLayer = L.geoJSON(data);
  violResolutionCodeLoaded = true;
  return violResolutionCodeLayer;
}

// Lazy-load the violStatus layer on demand for slides 4 and 5.
let violStatusLayer = null;
let violStatusLoaded = false;
async function ensureViolStatus() {
  if (violStatusLoaded) return violStatusLayer;
  const path = 'data/violStatus.geojson';
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();

  // keep raw data available if other code expects it
  window.violStatusLayer = data;
  violStatusLayer = L.geoJSON(data);
  violStatusLoaded = true;
  return violStatusLayer;
}

// Lazy-load the violTypeYear layer on demand for slides 4 and 5.
let violTypeYearLayer = null;
let violTypeYearLoaded = false;
async function ensureViolTypeYear() {
  if (violTypeYearLoaded) return violTypeYearLayer;
  const path = 'data/violTypeYear.geojson';
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  const data = await res.json();

  // keep raw data available if other code expects it
  window.violTypeYearLayer = data;
  violTypeYearLayer = L.geoJSON(data);
  violTypeYearLoaded = true;
  return violTypeYearLayer;
}

// Track whether we've added the violPerAddress layer to the overlays control
let violPerAddressAddedToControl = false;


// ## The Base Tile Layer
const Stadia_StamenTonerLite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});
Stadia_StamenTonerLite.addTo(map);

// Creating map layer group
const overlayMaps = {
  "Properties with the Most Violations Per Year": violPerAddressLayer,
  "Violation Statuses": violStatusLayer,
  "Violation Types": violTypeYearLayer,
  "Violation Resolution Codes": violResolutionCodeLayer
}

// create control but add overlays later:
const overlaysControl = L.control.layers(null, null).addTo(map);


{
  // ## Interface Elements (simplified)
  const container = document.querySelector('.slide-section');
  const slides = document.querySelectorAll('.slide');

  // Keep your existing slideOptions (only styles/handlers are relevant to SlideDeck)
  const slideOptions = {
      'title-slide': { style: (_feature) => 
        ({ 
        color: 'black', 
        fillColor: 'whitesmoke', 
        fillOpacity: 1, 
        weight: 2, 
      }), 
      zoom: 12 
    },
      'second-slide': { style: (_feature) => ({ 
        // color: '#802525ff', //
        color: 'black',
        fillColor: 'whitesmoke', 
        fillOpacity: 1, 
        weight: 2, 
      }), 
      zoom: 14 
    },
      'third-slide': { style: (_feature) => ({ 
        color: 'black',
        fillColor: 'whitesmoke',
        fillOpacity: 1, 
        weight: 2, 
      }), 
    },
      'fourth-slide': { 
          pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
          radius: 6,
          fillColor: 'black',
          color: 'lightgrey',
          weight: 1,
          opacity: 1,
          fillOpacity: 1,
      }),
        style: (_feature) => ({ 
        color: 'black',
        fillColor: 'whitesmoke',
        fillOpacity: 1, 
          weight: 2, 
      }),
    },
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

  // Toggle the violPerAddress overlay for slides 4 and 5 (indices 3 and 4)
  async function toggleViolPerAddress() {
    const idx = deck.currentSlideIndex;
    const shouldShow = idx === 3 || idx === 4;
    if (shouldShow) {
      try {
        const layer = await ensureViolPerAddress();
        if (!map.hasLayer(layer)) map.addLayer(layer);
        if (!violPerAddressAddedToControl) {
          overlaysControl.addOverlay(layer, 'Properties with the Most Violations Per Year');
          violPerAddressAddedToControl = true;
        }
      } catch (err) {
        console.error('Error loading violPerAddress layer:', err);
      }
    } else {
      if (violPerAddressLoaded && map.hasLayer(violPerAddressLayer)) {
        map.removeLayer(violPerAddressLayer);
      }
    }
  }

  // initial state
  toggleViolPerAddress();

}
