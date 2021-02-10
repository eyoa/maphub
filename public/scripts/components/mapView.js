$(() => {
  window.$mapView = $(`
  <div class="container" id="mapView">
    <div class="container" id="mapView-header-container"></div>
    <div class="container" id="mapView-display-container"></div>
    <div class="container" id="mapView-content-container"></div>
  </div>
  `);

  window.$mapView = $mapView;
  const $headerContainer = $mapView.find(`#mapView-header-container`);
  const $displayContainer = $mapView.find(`#mapView-display-container`);
  const $contentContainer = $mapView.find(`#mapView-content-container`);

  //mapView state: view, editDetail, editMap
  window.currMapViewState = 'view';

  const fetchLeafletMap = function (mapDetails) {
    // figure this out later.....
  };

  const insertHeader = function(map, currentUser, state, collabs) {
    $headerContainer.empty();
    const mapHeader = mapViewHeader.createMapHeader(map, currentUser, state, collabs);
    $headerContainer.append(mapHeader);
  }

  const insertMapDisplay = function (map) {
    $displayContainer.empty();
    if (!map) {
      $displayContainer.append(`<div>map goes here :)</div>`)
      // display default map @ default coord & default zoom level
    } else {
      getMapDetails(map).then(json => {
        //$displayContainer.append(fetchLeafletMap(json.data))
        $displayContainer.append(`<div>map goes here :)</div>`)
      });
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
  const displayMapView = function (map, currentUser, state) {
    if (!map) {
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
      insertMapDisplay(map);
      if(state === "view" || state === "editDetail") {
        insertContent(map, currentUser, state, "pinList", pins);
      } else {
        insertContent(map, currentUser, state, "mapForm", map);
      }
    });
  };

  //for buttons that manipulate content, use insertHeader and insertContent


  //on click listener for navigating mapView ======================================================================

  // view -> editMap/editDetails
  $(document).on('click', '#edit-map', function(event) {
    event.preventDefault();
    if (window.currentUser === window.currentMap.owner_id) {
      window.currMapViewState = "editMap"
    } else {
      window.currMapViewState = "editDetail"
    }
    displayMapView(window.currentMap, window.currentUser, window.currMapViewState);
  });

  // editMap -> editDetails
  $(document).on('click', '#quit-map-edit', function(event) {
    event.preventDefault();
    getMapList()
      .then((data) =>{
        console.log("data is", data);
        mapList.addMapEntries(data);
        views_manager.show('mapList');
      })
      .catch(error => console.error(error));
  });

  //this one needs to update db
  $(document).on('click', '#save-continue-map-edit', function(event) {
    event.preventDefault();
    if (!window.currentMap) {
      //create map
    } else {
      //update map
    }
    //window.currentMap = result of update/edit
    window.currMapViewState = "editDetail";
    displayMapView(window.currentMap, window.currentUser, window.currMapViewState)
  });

  //this one needs to update db
  $(document).on('click', '#delete-map', function(event) {
    //delete current map from db

    event.preventDefault();
    getMapList()
      .then((data) =>{
        console.log("data is", data);
        mapList.addMapEntries(data);
        views_manager.show('mapList');
      })
      .catch(error => console.error(error));
  });

  $(document).on('click', '#exit-editor', function(event) {
    event.preventDefault();
    window.currMapViewState = "view"
    displayMapView(window.currentMap, window.currentUser, window.currMapViewState);
  });

  //=================================================================================================================

  //CONTENT EVENTS

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

  we can attach/remove event listeners on click based on buttons that changes states

  event elemnt (accessible state & permission) : resulting action
  - dont care about permissions for event listeners
  - permissions should be covered by displaying correct buttons/elements accordingly

    HEADER EVENTS
      - onclick favToggle (view & logged in user) : update fav for currentUser

    CONTENT EVENTS
      - onclick pin item (view & anyone) : display pinDetail
      - onclick back to pin list button (view & anyone): display pinList

      - onclick search button: (editMap & owner/anyone) : update coords in form and leaflet map

      - onclick add collab button (editDetail & owner) : update db, append to collab list
      - onclick deelet collab button (editDetail & owner) : update db, remove from collab list

      - onclick pin list (editDetail & owner) : show pin list
      - onclick collab list (editDetail & owner) : show collab list
      - onclick search button: (editDetail & owner/collab) : show pinForm, update coords in form and leaflet map

      - onclick edit pin button : (editDetail & owner/collab) : show pinForm
      - onclick delete pin button : (editDetail & owner/collab) : update db, refresh pin list
      - onclick add pin button : (editDetail & owner/collab) : update db, refresh pin list
      - onclick cancel edit button : (editDetail & owner/collab) : show pin list

  */
  window.$mapView.displayMapView = displayMapView;
});
