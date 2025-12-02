/**
 * A slide deck object
 */
class SlideDeck {
  /**
   * Constructor for the SlideDeck object.
   * @param {Node} container The container element for the slides.
   * @param {NodeList} slides A list of HTML elements containing the slide text.
   * @param {L.map} map The Leaflet map where data will be shown.
   * @param {object} slideOptions The options to create each slide's L.geoJSON
   *                              layer, keyed by slide ID.
   */
  constructor(container, slides, map, slideOptions = {}) {
    this.container = container;
    this.slides = slides;
    this.map = map;
    this.slideOptions = slideOptions;

    this.dataLayer = L.layerGroup().addTo(map);
    this.currentSlideIndex = 0;
  }

  /**
   * ### updateDataLayer
   *
   * The updateDataLayer function will clear any markers or shapes previously
   * added to the GeoJSON layer on the map, and replace them with the data
   * provided in the `data` argument. The `data` should contain a GeoJSON
   * FeatureCollection object.
   *
   * @param {object} data A GeoJSON FeatureCollection object
   * @param {object} options Options to pass to L.geoJSON
   * @return {L.GeoJSONLayer} The new GeoJSON layer that has been added to the
   *                          data layer group.
   */
  updateDataLayer(data, options) {
    this.dataLayer.clearLayers();

    const defaultOptions = {
      pointToLayer: (p, latlng) => L.marker(latlng),
      style: (feature) => feature.properties.style,
    };
    const geoJsonLayer = L.geoJSON(data, options || defaultOptions)
        .bindTooltip((l) => l.feature.properties.label)
        .addTo(this.dataLayer);

    return geoJsonLayer;
  }

  /**
   * ### getSlideFeatureCollection
   *
   * Load the slide's features from a GeoJSON file.
   *
   * @param {HTMLElement} slide The slide's HTML element. The element id should match the key for the slide's GeoJSON file
   * @return {object} The FeatureCollection as loaded from the data file
   */
  async getSlideFeatureCollection(slide) {
    const resp = await fetch(`data/${slide.id}.json`);
    const data = await resp.json();
    return data;
  }

  /**
   * ### hideAllSlides
   *
   * Add the hidden class to all slides' HTML elements.
   *
   * @param {NodeList} slides The set of all slide elements, in order.
   */
  hideAllSlides() {
    for (const slide of this.slides) {
      slide.classList.add('hidden');
    }
  }

  /**
   * ### syncMapToSlide
   *
   * Go to the slide that mathces the specified ID.
   *
   * @param {HTMLElement} slide The slide's HTML element
   */
  async syncMapToSlide(slide) {
    const collection = await this.getSlideFeatureCollection(slide);
    const options = this.slideOptions[slide.id];
    const layer = this.updateDataLayer(collection, options);

    /**
     * Create a bounds object from a GeoJSON bbox array.
     * @param {Array} bbox The bounding box of the collection
     * @return {L.latLngBounds} The bounds object
     */
    const boundsFromBbox = (bbox) => {
      const [west, south, east, north] = bbox;
      const bounds = L.latLngBounds(
          L.latLng(south, west),
          L.latLng(north, east),
      );
      return bounds;
    };

    /**
     * Create a temporary event handler that will show tooltips on the map
     * features, after the map is done "flying" to contain the data layer.
     */
    let handleFlyEnd = () => {
      if (slide.showpopups) {
        layer.eachLayer((l) => {
          l.bindTooltip(l.feature.properties.label, { permanent: true });
          l.openTooltip();
        });
      }
      this.map.removeEventListener('moveend', handleFlyEnd);
    };

    this.map.addEventListener('moveend', handleFlyEnd);

    // Modifying the flyOptions so that the map sits to the left of the viewport, and the slides don't overlap it
    // Copilot says: 
      // Build fly/fit options and bias the bounds to the left so the map's
      // important content appears on the left side of the viewport when slides
      // are rendered on top of the map. We compute the slide overlay width in
      // pixels and add it as right padding (paddingBottomRight) to fitBounds.
    const slideEl = document.querySelector('.slide');
    const slideWidthPx = slideEl ? slideEl.offsetWidth : Math.round(window.innerWidth * 0.4);

    const flyOptions = {};
    if (options && options.zoom) flyOptions.maxZoom = options.zoom;
    const paddingRight = Math.min(slideWidthPx + 24, Math.round(window.innerWidth * 0.75));
    flyOptions.paddingBottomRight = [paddingRight, 0];

    if (collection.bbox) {
      this.map.flyToBounds(boundsFromBbox(collection.bbox), flyOptions);
    } else {
      this.map.flyToBounds(layer.getBounds(), flyOptions);
    }
  }

  /**
   * Show the slide with ID matched by currentSlideIndex. If currentSlideIndex is
   * null, then show the first slide.
   */
  async syncMapToCurrentSlide() {
    const slide = this.slides[this.currentSlideIndex];
    await this.syncMapToSlide(slide);
  } 
  //This is the end of function that syncs the map to the current slide. this basically ensures that when you scroll to a new slide, the map updates to match that slide. 
  // The slide file is fetched from the data folder based on the slide's ID. 
  // The slide file is styled based on the options in the slideOptions object passed to the SlideDeck constructor located in line 76 of index.js.

  /**
   * Increment the currentSlideIndex and show the corresponding slide. If the
   * current slide is the final slide, then the next is the first.
   */


  goNextSlide() {
    this.currentSlideIndex++;

    if (this.currentSlideIndex === this.slides.length) {
      this.currentSlideIndex = 0;
    }  //this function goNextSlide checks the index of the current slide to see if it is the last slide. 
    // If it is not the last slide, it increments the index by 1 to show the next slide.

    this.syncMapToCurrentSlide(); //If it is the last slide, the function syncs the map to the first slide by setting the currentSlideIndex to 0.
    //this.syncMapToCurrentSlide() then updates the map to match the current slide. 
    // this. in js is a reference to the current object instance, in this case, the SlideDeck object. We know it is rerferencing the SlideDeck object because the function is defined within the SlideDeck class in line 3 of slidedeck.js.
  }

  /**
   * Decrement the currentSlideIndes and show the corresponding slide. If the
   * current slide is the first slide, then the previous is the final.
   */
  goPrevSlide() {
    this.currentSlideIndex--;

    if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.slides.length - 1;
    }

    this.syncMapToCurrentSlide();
  }

  /**
   * ### preloadFeatureCollections
   *
   * Initiate a fetch on all slide data so that the browser can cache the
   * requests. This way, when a specific slide is loaded it has a better chance
   * of loading quickly.
   */
  preloadFeatureCollections() {
    for (const slide of this.slides) {
      this.getSlideFeatureCollection(slide);
    }
  }

  /**
   * Calculate the current slide index based on the current scroll position.
   */
  calcCurrentSlideIndex() {
    const scrollPos = window.scrollY - this.container.offsetTop;
    const windowHeight = window.innerHeight;

    let i;
    for (i = 0; i < this.slides.length; i++) {
      const slidePos =
        this.slides[i].offsetTop - scrollPos + windowHeight * 0.7;
      if (slidePos >= 0) {
        break;
      }
    }

    if (i !== this.currentSlideIndex) {
      this.currentSlideIndex = i;
      this.syncMapToCurrentSlide();
    }
  }
}

export { SlideDeck };
