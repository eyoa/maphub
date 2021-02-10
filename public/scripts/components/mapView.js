$(() => {
  window.$mapView = $(`
  <div class="container" id="mapView">
    <div class="container" id="mapView-header-container"></div>
    <div class="container" style="height:500px; margin:3rem" id="mapView-display-container"></div>
    <div class="container" id="mapView-content-container"></div>
  </div>
  `);

  window.$mapView = $mapView;
  const $headerContainer = $mapView.find(`#mapView-header-container`);
  const $displayContainer = $mapView.find(`#mapView-display-container`);
  const $contentContainer = $mapView.find(`#mapView-content-container`);

  //mapView state: view, editDetail, editMap
  window.currentState = 'view';


  const loadMap = function (mapDetails, pins = null) {
    // extract for easier reading
    const zoom_lv = mapDetails.zoom_lv;
    const lon = mapDetails.longitude;
    const lat = mapDetails.latitude;

      // checking for previous instance of the map(leaflet) and kill it
      if (window.mapView.leafMap != null){
        window.mapView.leafMap.off();
        window.mapView.leafMap.remove();
      }

    // setup leaflet map
    var leafMap = L.map('mapView-display-container').setView([lat, lon], zoom_lv);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(leafMap);

    // show the scale bar on the lower left corner
    L.control.scale().addTo(leafMap);


    if (pins){
      const pinsArray = [];

      for (const pin of pins){
        const latlon = [];
        latlon.push(Number(pin.latitude));
        latlon.push(Number(pin.longitude));

        const popUp = `
        <h3>${pin.title}</h3>
        <div class="d-flex flex-row">
          <img src="${pin.img_url}" width="100" height="100"></img>
          <p class ="mx-3">${pin.description}</p>
        </div>
        `;


        const marker = L.marker(latlon).bindPopup(popUp).addTo(leafMap);

        pinsArray.push(marker);
      }

      // for more adjustements probably better as a layer to adjust
      // const allThePins = L.layerGroup(pinsArray);
      // L.control.layers(allThePins).addTo(leafMap);

    }

    // set global to control map and check if an instance already exists
    window.mapView.leafMap = leafMap;
  };

  const insertHeader = function(map, currentUser, state, collabs) {
    $headerContainer.empty();
    const mapHeader = mapViewHeader.createMapHeader(map, currentUser, state, collabs);
    $headerContainer.append(mapHeader);
  }

  const insertMapDisplay = function (map, pins) {
    $displayContainer.empty();

    if (!map) {
      // default values are toronto
      loadMap({latitude: "43.653274", longitude: "-79.381397", zoom_lv: 8});
    } else {
      loadMap(map, pins);
    }

  };

  const insertContent = function(map, currentUser, state, contentType, contentData){
    $contentContainer.empty();
    const mapContent = $mapViewContent.createMapContent(map, currentUser, state, contentType, contentData);
    $contentContainer.append(mapContent);
  }

  //default display:
  // view, editDetails -> pinList | editMap -> mapForm
  //displays default page of a given state. use this for buttons that change mapView state
  //if map is empty sends you straight to editMap (create/edit page)
  const displayMapView = function (map, currentUser, state) {
    if (!map) { //no map -> send to create page
      insertHeader(map, currentUser, state);
      insertMapDisplay(map);
      insertContent(map, currentUser, state, "mapForm", map);
      return;
    }

    Promise.all([getMapPins(`id=${map.id}`), getCollaborators(`id=${map.id}`)]).then(output=> {
      const pins = output[0];
      output[1];
      const collabs = [];
      for (const collab of output[1]) collabs.push(collab.id);

      insertHeader(map, currentUser, state, collabs);
      insertMapDisplay(map, pins);
      if(state === "view" || state === "editDetail") {
        insertContent(map, currentUser, state, "pinList", pins);
      } else {
        insertContent(map, currentUser, state, "mapForm", map);
      }
    });
  };

  //for buttons that manipulate content, use insertHeader and insertContent

//////////////////////////////////// EVENT LISTENERS ////////////////////////////////////////////////////////////

  //on click listener for navigating mapView ======================================================================

  //clicking edit map will send you to either editMap (mapinfo edit) or editDetail (pins) depending on if youre owner or not
  $(document).on('click', '#edit-map', function(event) {
    event.preventDefault();
    if (currentUser === currentMap.owner_id) {
      currentState = "editMap"
    } else {
      currentState = "editDetail"
    }
    displayMapView(currentMap, currentUser, currentState);
  });

  //quitting creation will send you back to browse
  $(document).on('click', '#quit-map-edit', function(event) {
    event.preventDefault();
    getMapList()
      .then((data) =>{
        mapList.addMapEntries(data);
        views_manager.show('mapList');
        currentState = 'view';
      })
      .catch(error => console.error(error));
  });

  //create new map/update map
  $(document).on('click', '#save-continue-map-edit', function(event) {
    event.preventDefault();
    if (!currentMap) {
      //TO DO
      //create map
    } else {
      //TO DO
      //update map
    }
    //window.currentMap = result of update/edit
    currentState = 'editDetail';
    displayMapView(currentMap, currentUser, 'editDetail')
  });

  //delete map
  $(document).on('click', '#delete-map', function(event) {
    //TO DO
    //delete current map from db

    event.preventDefault();
    getMapList()
      .then((data) =>{
        mapList.addMapEntries(data);
        currentState = 'view';
        currentMap = null;
        views_manager.show('mapList');
      })
      .catch(error => console.error(error));
  });

  //exiting editor will send you to the map detail view of the map you were working on
  $(document).on('click', '#exit-editor', function(event) {
    event.preventDefault();
    currentState = 'view';
    displayMapView(currentMap, currentUser, 'view');
  });

  //======on click events without database interaction (strictly displays)========================================

  // display pinlist
  $(document).on('click', '#get-pin-list', function(event) {
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentUser, currentState, "pinList", pins);
    });
  });

  //display collaborators
  $(document).on('click', '#get-collab-list', function(event) {
    event.preventDefault();
    getCollaborators(`id=${currentMap.id}`).then(output => {
      const collabs = output;
      insertContent(currentMap, currentUser, currentState, "collabList", collabs);
    });
  });

  //display pin detail when pin clicked
  $(document).on('click', '.pin-title', function(event){
    event.preventDefault();
    const pinId = $(this).closest('.pin-item').attr('id');
    getPinDetails(`id=${pinId}`).then(output => {
      const pin = output[0];
      insertContent(currentMap, currentUser, currentState, "pinDetail", pin);
    });
  });

  //display pin list when pin detail closed
  $(document).on('click', '#close-pin-detail', function(event){
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentUser, currentState, "pinList", pins);
    });
  });

  //display pin form when click add pin
  $(document).on('click', '#pin-add-prompt', function(event) {
    event.preventDefault();
    insertContent(currentMap, currentUser, currentState, "pinForm", null);
  });

  //display pin form when click edit pin
  $(document).on('click', '#pin-edit-prompt', function(event) {
    event.preventDefault();
    const pinId = $(this).closest(".pin-item").attr('id');
    getPinDetails(`id=${pinId}`).then(output => {
      const pin = output[0];
      insertContent(currentMap, currentUser, currentState, "pinForm", pin);
    });
  });

  //display pin list when edit/add is canceled
  $(document).on('click', '#cancel-pin-detail-edit', function(event){
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentUser, currentState, "pinList", pins);
    });
  });

  //======on click events with db changes ========================================================================================

  //clicking add pin will add it in the db and display pinlist once done
  $(document).on('click', '.add-pin-detail', function(event){
    event.preventDefault();
    //TO DO
    //add pin to db

    //display pin list
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentUser, currentState, "pinList", pins);
    });
  });

  //saving your edit changes will update db and display pinList once done
  $(document).on('click', '.edit-pin-detail', function(event){
    event.preventDefault();

    const pinId = $(this).closest(".pinForm").attr("id");
    //TO DO
    //update this pin id in db

    //display pin list
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentUser, currentState, "pinList", pins);
    });
  });

  //delete pin - update db and refresh pinList
  $(document).on('click', '', function(event) {
    event.preventDefault();
  });

  //add collab - update db and refresh collabList
  $(document).on('click', '', function(event) {
    event.preventDefault();
  });

  //delete collab - update db and refresh collabList
  $(document).on('click', '', function(event) {
    event.preventDefault();
  });

  //fav toggle - update db and update visuals
  $(document).on('click', '', function(event) {
    event.preventDefault();
  });

  /*
  //mapView state: view, editDetail, editMap

  listeners for leaflet map display: dynamic behavior depending on state.
      - onclick listener for existing pin
        - view : pinDetails
        - editMap : no event
        - editDetail : pinForm
      - onclick listener for map for creating pin
        - view: nothing
        - editMap: nothing
        - editDetail: and update coords in pinForm

    search buttons.... stretch.
      - onclick search button: (editMap & owner/anyone) : update coords in form and leaflet map
      - onclick search button: (editDetail & owner/collab) : show pinForm, update coords in form and leaflet map
  */

  window.$mapView.displayMapView = displayMapView;
});
