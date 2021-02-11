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

  /////////////////////leaflet ////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
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

  /////////////////////leaflet ////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  const insertHeader = function(map, state) {
    Promise.all([getUserWithCookies(), getCollaborators(`id=${map.id}`)])
    .then(res1 => {
      const currentUser = res1[0].user? res1[0].user.id : null;
      const collabs = []
      for (const collab of res1[1]) {
        collabs.push(collab.id);
      }
      getMapList(`user_id=${currentUser}`)
      .then(res2 => {
        const mapList = res2;
        const favList = [];
        for(const mapKey in mapList) {
          favList.push(mapList[mapKey].id);
        }

        $headerContainer.empty();
        const mapHeader = mapViewHeader.createMapHeader(map, currentUser, state, collabs, favList);
        $headerContainer.append(mapHeader);
      })
    })
  };

  const insertMapDisplay = function (map, pins) {
    $displayContainer.empty();

    if (!map) {
      // default values are toronto
      loadMap({latitude: "43.653274", longitude: "-79.381397", zoom_lv: 8});
    } else {
      loadMap(map, pins);
    }

  };

  const insertContent = function(map, state, contentType, contentData){
    getUserWithCookies()
    .then(output => {
      const currentUser = output.user ? output.user.id : null;
      $contentContainer.empty();
      const mapContent = $mapViewContent.createMapContent(map, currentUser, state, contentType, contentData);
      $contentContainer.append(mapContent);
    })
  }

  //default display:
  // view, editDetails -> pinList | editMap -> mapForm
  //displays default page of a given state. use this for buttons that change mapView state
  //if map is empty sends you straight to editMap (create/edit page)
  const displayMapView = function (map, state) {
    if (!map) { //no map -> send to create page
      insertHeader(map, state);
      insertMapDisplay(map);
      insertContent(map, state, "mapForm", map);
      return;
    }

    Promise.all([getMapPins(`id=${map.id}`), getCollaborators(`id=${map.id}`)]).then(output=> {
      const pins = output[0];
      output[1];
      const collabs = [];
      for (const collab of output[1]) collabs.push(collab.id);

      insertHeader(map, state);
      insertMapDisplay(map, pins);
      if(state === "view" || state === "editDetail") {
        insertContent(map, state, "pinList", pins);
      } else {
        insertContent(map, state, "mapForm", map);
      }
    });
  };

  //for buttons that manipulate content, use insertHeader and insertContent

//////////////////////////////////// EVENT LISTENERS ////////////////////////////////////////////////////////////

  //on click listener for navigating mapView ======================================================================

  //clicking edit map will send you to either editMap (mapinfo edit) or editDetail (pins) depending on if youre owner or not
  $mapView.on('click', '#edit-map', function(event) {
    event.preventDefault();
    if (currentUser === currentMap.owner_id) {
      currentState = "editMap"
    } else {
      currentState = "editDetail"
    }
    displayMapView(currentMap, currentState);
  });

  //quitting creation will send you back to browse
  $mapView.on('click', '#quit-map-edit', function(event) {
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
  $mapView.on('click', '#save-continue-map-edit', function(event) {
    event.preventDefault();
    if (!currentMap) {
      // get map center and zoom lv and put together with form fields
      const zoom = window.mapView.leafMap.getZoom();
      const {lat, lng} = window.mapView.leafMap.getCenter();
      const formdata = $(this).closest('#map-detailForm').serializeArray();

      formdata.push({name: "latitude", value: lat});
      formdata.push({name: "longitude", value: lng});
      formdata.push({name: "zoom_lv", value: zoom});

      addMap(formdata)
      .then( result => {
        console.log("Map added successfully?");
        console.log(result);


        // ========================================================================
        // needs to go to where you can add pins....

        displayMapView(result.id, currentUser, 'editDetail');
        insertContent(result.id, currentUser, currentState, "pinList", pins);


      })
      .catch(e => console.log(e));

    } else {
      // get map center and zoom lv and put together with form fields
      const zoom = window.mapView.leafMap.getZoom();
      const {lat, lng} = window.mapView.leafMap.getCenter();
      const formdata = $(this).closest('#map-detailForm').serializeArray();

      formdata.push({name: "latitude", value: lat});
      formdata.push({name: "longitude", value: lng});
      formdata.push({name: "zoom_lv", value: zoom});
      formdata.push({name: "id", value: currentMap.id});

      editMap(formdata)
      .then( result => {
        console.log("back in handler");
        console.log(result);

        getMapPins(result.id).then(output => {
        //display pin list
        const pins = output;
        displayMapView(currentMap, currentUser, 'editDetail');
        insertContent(currentMap, currentUser, currentState, "pinList", pins);
        })

      })
      .catch(e => console.log(e));

    }
<<<<<<< HEAD
=======
    //window.currentMap = result of update/edit
    currentState = 'editDetail';
    displayMapView(currentMap, 'editDetail')
>>>>>>> dev
  });

  //delete map
  $mapView.on('click', '#delete-map', function(event) {
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
  $mapView.on('click', '#exit-editor', function(event) {
    event.preventDefault();
    currentState = 'view';
    displayMapView(currentMap, 'view');
  });

  //======on click events without database interaction (strictly displays)========================================

  // display pinlist
  $mapView.on('click', '#get-pin-list', function(event) {
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentState, "pinList", pins);
    });
  });

  //display collaborators
  $mapView.on('click', '#get-collab-list', function(event) {
    event.preventDefault();
    getCollaborators(`id=${currentMap.id}`).then(output => {
      const collabs = output;
      insertContent(currentMap, currentState, "collabList", collabs);
    });
  });

  //display pin detail when pin clicked
  $mapView.on('click', '.pin-title', function(event){
    event.preventDefault();
    const pinId = $(this).closest('.pin-item').attr('id');
    getPinDetails(`id=${pinId}`).then(output => {
      const pin = output[0];
      insertContent(currentMap, currentState, "pinDetail", pin);
    });
  });

  //display pin list when pin detail closed
  $mapView.on('click', '#close-pin-detail', function(event){
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentState, "pinList", pins);
    });
  });

  //display pin form when click add pin
  $mapView.on('click', '#pin-add-prompt', function(event) {
    event.preventDefault();
    insertContent(currentMap, currentState, "pinForm", null);

    const mapCenter = window.mapView.leafMap.getCenter();

    // maybe check for already newPin
    // put draggable pin on map
    const newPin = L.marker(mapCenter, {draggable: true}).addTo(window.mapView.leafMap);

    window.mapView.newPin = newPin;
  });

  //display pin form when click edit pin
  $mapView.on('click', '#pin-edit-prompt', function(event) {
    event.preventDefault();
    const pinId = $(this).closest(".pin-item").attr('id');


    getPinDetails(`id=${pinId}`).then(output => {
      const pin = output[0];
      const point = L.latLng(Number(pin.latitude), Number(pin.longitude));

      // check there's no extra ones somehow?
      const editPin = L.marker(point, {draggable: true}).addTo(window.mapView.leafMap);
      window.mapView.editPin = editPin;
      insertContent(currentMap, currentState, "pinForm", pin);
    });
  });

  //display pin list when edit/add is canceled
  $mapView.on('click', '#cancel-pin-detail-edit', function(event){
    event.preventDefault();
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentState, "pinList", pins);
    });
  });

  //======on click events with db changes ========================================================================================

  //clicking add pin will add it in the db and display pinlist once done
  $mapView.on('click', '.add-pin-detail', function(event){
    event.preventDefault();
      // get coords of new pin and add to form data
      const {lat, lng} = window.mapView.newPin.getLatLng();
      const formdata = $(this).parent("#pin-Form").serializeArray();
      formdata.push({name: "latitude", value: lat});
      formdata.push({name: "longitude", value: lng});
      formdata.push({name: "map_id", value: currentMap.id});

      addPin(formdata)
      .then(result =>{
        getMapPins(`id=${currentMap.id}`).then(output => {
        //display pin list
        const pins = output;
        insertContent(currentMap, currentState, "pinList", pins);
        displayMapView(currentMap, 'editDetail');
      })
      .catch(e => console.log(e))


    });
  });

  // saving your edit changes will update db and display pinList once done
  // currently doesn't track changes? just all the fields?
  $mapView.on('click', '.edit-pin-detail', function(event){
    event.preventDefault();
    const pinId = $(this).closest('#pin-Form').attr("value");

    const {lat, lng} = window.mapView.editPin.getLatLng();
    const formdata = $(this).parent("#pin-Form").serializeArray();
    formdata.push({name: "id", value: pinId});
    formdata.push({name: "latitude", value: lat});
    formdata.push({name: "longitude", value: lng});
    formdata.push({name: "map_id", value: currentMap.id});


    editPin(formdata)
      .then(result =>{
        getMapPins(`id=${currentMap.id}`).then(output => {
        //display pin list
        const pins = output;
        displayMapView(currentMap, 'editDetail');
      })
      .catch(e => console.log(e))


    });


  });

  //delete pin - update db and refresh pinList
  $mapView.on('click', '#pin-remove', function(event) {
    event.preventDefault();

    const idAttr =$(this).closest('.pin-item').attr('id');
    const pinId = {id: idAttr}

    removePin(pinId)
    .then(result => {
      displayMapView(currentMap, 'editDetail');
    })
    .catch(e => console.log(e));
  });

  //add collab - update db and refresh collabList
  $mapView.on('click', '', function(event) {
    event.preventDefault();
  });

  //delete collab - update db and refresh collabList
  $(document).on('click', '', function(event) {
    event.preventDefault();
  });

  //fav toggle - update db and update visuals
  $mapView.on('click', '.fav-Toggle', function(event){
    event.preventDefault();

    elementId = $(this).attr('id');
    mapId = currentMap.id;

    getUserWithCookies()
    .then(output => {
      const currUser = output.user;
      if(currUser){
        if(elementId === 'fav') {
          $(this).attr('id', 'not-fav');
          $(this).attr('src', './../../images/fav-unsel.png')
          removeFav(`map_id=${mapId}&user_id=${currUser.id}`);
        } else {
          $(this).attr('id', 'fav');
          $(this).attr('src', './../../images/fav-sel.png')
          addFav(`map_id=${mapId}&user_id=${currUser.id}`);
        }
      }
    });
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
