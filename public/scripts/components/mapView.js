const { getMapDetails } = require("../../../server/database");

$(() => {
  const $mapView = $(`
  <div class="container" id="userProfile">
    <div class="container" id="mapView-header-container"></div>
    <div class="container" id="mapView-display-container"></div>
    <div class="container" id="mapView-content-container"></div>
  </div>
  `);

  window.$mapView = $mapView;
  $headerContainer = $(`#mapView-header-container`);
  $displayContainer = $(`#mapView-display-container`);
  $contentContainer = $(`#mapView-content-container`);

  //mapView state: view, editDetail, editMap
  window.mapViewState = 'view';

  const fetchLeafletMap = function (mapDetails) {
    // figure this out later.....
  };

  const insertHeader = function(map, currentUser, state) {
    //need this in network
    getMapCollaborators(/*params*/).then(json => {
      const mapCollaborators = ;//json...
      $headerContainer.empty();
      const mapHeader = mapViewHeader.createMapHeader(map, currentUser, state, mapCollaborators);
      $headerContainer.append(mapHeader);
    });
  }

  const insertMapDisplay = function (map) {
    $displayContainer.empty();
    if (!map) {
      // display default map @ default coord & default zoom level
    } else {
      getMailDetails(map).then(json => {
        $displayContainer.append(fetchLeafletMap(json.data))
      });
    }
  };

  const insertContent = function(map, currentUser, state) {
    $contentContainer.empty();
    const mapContent = mapViewContent.createMapContent(map, currentUser, state);
    $contentContainer.append(mapContent);
  }

  const displayMapView = function (map, currentUser, state) {
    insertHeader(map, currentUser, state);
    insertMapDisplay(map);
    insertContent(map, currentUser, state);
  };

  window.mapView.displayMapView = displayMapView;

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
    header
      - onclick favToggle (view & logged in user) : update fav for currentUser
      - onclick edit map (view & owner/collab) :
          - if owner, view -> editMap
          - if collab, view -> editDetail
      - onclick exit editor (editDetail & owner/collab) : editDetail -> view

    content
      - onclick pin item (view & anyone) : display pinDetail
      - onclick back to pin list button (view & anyone): display pinList

      - onclick search button: (editMap & owner/anyone) : update coords in form and leaflet map
      - onclick save and continue button (editMap & owner/anyone) : add/update maps in db, editMap -> editDetail
      - onclick quit without saving (editMap & owner/anyone) : editMap -> view/browse (depending on create or edit)
      - onclick delete map (editMap & owner): delete from db, editMap -> browse

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
});
