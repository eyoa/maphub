$(() => {
  window.$mapView = $(`
  <div class="container" id="mapView">
    <div class="container" id="mapView-header-container"></div>
    <div class="container mx-auto" style="height:500px; margin:3rem;" id="display-map"></div>
    <div class="container my-3" id="mapView-content-container"></div>
  </div>
  `);

  window.mapView = {leafMap: null};
  const $headerContainer = $mapView.find(`#mapView-header-container`);
  // const $displayContainer = $mapView.find(`#mapView-display-container`);
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
    const leafMap = L.map('display-map').setView([lat, lon], zoom_lv);

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

    }

    //press and hold event: drop a pin and prompt an add
    let newMarker = {};

    if(currentState === 'editDetail'){
      leafMap.on('mousedown', function(event) {
        timeoutId = setTimeout(
        function() {
          let latitude = event.latlng.lat;
          let longitude = event.latlng.lng;
          let title = '';
          let description = '';
          let img_url = '';

          insertContent(currentMap, currentState, 'pinForm', {latitude, longitude, title, description, img_url});
          if (newMarker) leafMap.removeLayer(newMarker);
          newMarker = L.marker([latitude, longitude]).addTo(leafMap);
        }, 1000);
      }).on('mouseup mouseleave', function() {
        clearTimeout(timeoutId);
      });
    }

    // set global to control map and check if an instance already exists
    window.mapView.leafMap = leafMap;
  };


  /////////////////////leaflet ////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  const insertHeader = function(map, state) {
    Promise.all([getUserWithCookies(), getCollaborators(`id=${!map ? null : map.id}`)])

    .then(res1 => {
      const currentUser = res1[0].user? res1[0].user.id : null;
      const collabs = []
      for (const collab of res1[1]) {
        collabs.push(collab.id);
      }

      //console.log('collab list: ', collabs);

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
      const mapContent = mapViewContent.createMapContent(map, currentUser, state, contentType, contentData);
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
  window.mapView.displayMapView = displayMapView;

  //for buttons that manipulate content, use insertHeader and insertContent

//////////////////////////////////// EVENT LISTENERS ////////////////////////////////////////////////////////////

  //on click listener for navigating mapView ======================================================================

  //clicking edit map will send you to either editMap (mapinfo edit) or editDetail (pins) depending on if youre owner or not
  $mapView.on('click', '#edit-map', function(event) {
    event.preventDefault();
    getUserWithCookies()
    .then(output => {
      const currUser = output.user ? output.user.id : null;
      if (currUser === currentMap.owner_id) {
        currentState = "editMap"
      } else {
        currentState = "editDetail"
      }
      displayMapView(currentMap, currentState);
    })


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
    const $form = $(this).closest('#map-detailForm');
    const title = $form.find('#edit-map-title').val();
    const desc = $form.find('#edit-map-description').val();

    if(!title || !desc){
      alert("Please don't leave fields blank");
      return;
    }


    // get map center and zoom lv and put together with form fields
    const zoom = window.mapView.leafMap.getZoom();
    const {lat, lng} = window.mapView.leafMap.getCenter();
    const formdata = $(this).closest('#map-detailForm').serializeArray();

    formdata.push({name: "latitude", value: lat});
    formdata.push({name: "longitude", value: lng});
    formdata.push({name: "zoom_lv", value: zoom});

    if (!currentMap) {

      addMap(formdata)
      .then( result => {
        currentMap = result[0];
        // ========================================================================
        // needs to go to where you can add pins....
        getUserWithCookies().then(output => {
          const currentUser = output.user ? output.user.id : null;

          console.log(`newmap id : ${currentMap.id}, currentUser: ${currentUser}`);
          addCollaborator(`map_id=${currentMap.id}&user_id=${currentUser}`)
          .then(res => {
            displayMapView(currentMap, 'editDetail');
            displayPinList();
          });
        });
      })
      .catch(e => console.log(e));

    } else {

      formdata.push({name: "id", value: currentMap.id});

      editMap(formdata)
      .then( result => {
        console.log("back in handler");
        currentMap = result[0];

        displayMapView(currentMap, 'editDetail');
        displayPinList();
      })
      .catch(e => console.log(e));

    }
    //window.currentMap = result of update/edit
    currentState = 'editDetail';
    displayMapView(currentMap, 'editDetail')
  });

  //delete map
  $mapView.on('click', '#delete-map', function(event) {
    event.preventDefault();

    const id = currentMap.id
    removeMap({id})
    .then(result => {
      console.log("map deleted!");
      getMapList()
      .then((data) =>{
        mapList.addMapEntries(data);
        currentState = 'view';
        currentMap = null;
        views_manager.show('mapList');
      })
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

  ///////these two show up a lot//////////////////////////////////////////////////////
  const displayPinList = function () {
    getMapPins(`id=${currentMap.id}`).then(output => {
      const pins = output;
      insertContent(currentMap, currentState, "pinList", pins);
    });
  }
  const displayCollabList = function () {
    getCollaborators(`id=${currentMap.id}`).then(output => {
      const collabs = output;
      insertContent(currentMap, currentState, "collabList", collabs);
    });
  }
  /////////////////////////////////////////////////////////////////////////

  // display pinlist
  $mapView.on('click', '#get-pin-list', function(event) {
    event.preventDefault();
    displayPinList();
  });

  //display collaborators
  $mapView.on('click', '#get-collab-list', function(event) {
    event.preventDefault();
    displayCollabList();
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
    displayPinList();
  });

  // //display pin form when click add pin
  // $mapView.on('click', '#pin-add-prompt', function(event) {
  //   event.preventDefault();
  //   insertContent(currentMap, currentState, "pinForm", null);

  //   const mapCenter = window.mapView.leafMap.getCenter();

    // put draggable pin on map
  //   if (!window.mapView.newPin){
  //     const newPin = L.marker(mapCenter, {draggable: true}).addTo(window.mapView.leafMap);
  //     window.mapView.newPin = newPin;
  //   }

  // });

  //display pin form when click edit pin
  $mapView.on('click', '#pin-edit-prompt', function(event) {
    event.preventDefault();
    const pinId = $(this).closest(".pin-item").attr('id');


    getPinDetails(`id=${pinId}`).then(output => {
      const pin = output[0];

      console.log(pin);
      insertContent(currentMap, currentState, 'pinForm', pin);


      mapView.leafMap.off('mousedown');

      let newMarker = {};
      mapView.leafMap.on('mousedown', function(event) {
        timeoutId = setTimeout(
        function() {
          pin.latitude = event.latlng.lat;
          pin.longitude = event.latlng.lng;

          insertContent(currentMap, currentState, 'pinForm', pin);

          if (newMarker) mapView.leafMap.removeLayer(newMarker);
          newMarker = L.marker([pin.latitude, pin.longitude]).addTo(mapView.leafMap);

        }, 1000);
      }).on('mouseup mouseleave', function() {
        clearTimeout(timeoutId);
      });

    });
  });

  //display pin list when edit/add is canceled
  $mapView.on('click', '#cancel-pin-detail-edit', function(event){
    event.preventDefault();
<<<<<<< HEAD

      if(window.mapView.editPin){
        window.mapView.editPin.remove();
        window.mapView.editPin = null;
      }
      if(window.mapView.newPin){
        window.mapView.newPin.remove();
        window.mapView.newPin = null;
      }

=======
    displayMapView(currentMap, currentState);
>>>>>>> dev
    displayPinList();
  });

  //redirect to collaborator's profile
  $mapView.on('click', '.collab-profile-link', function(event){
    event.preventDefault();
    if(currentState === 'view'){
      const viewUserId = $(this).closest('.collab-item-container').attr('id');

      Promise.all([getUserWithCookies(), getUser(`id=${viewUserId}`)])
      .then(output => {
        const currUser = output[0].user;
        const viewUser = output[1];
        $userProfile.displayUserProfile(viewUser, currUser);
        views_manager.show('profile');
      });
    }
  });

  //======on click events with db changes ========================================================================================

  //clicking add pin will add it in the db and display pinlist once done
  $mapView.on('click', '.add-pin-detail', function(event){
    event.preventDefault();
      const $form = $(this).parent("#pin-Form");
      const name = $form.find('#pin-form-title').val();
      const desc = $form.find('#pin-form-desc').val();
      const imgUrl = $form.find('#pin-form-img').val();

      if(!name || !desc || !imgUrl){
        alert("Please don't leave fields blank.");
        return;
      }

      // get coords of new pin and add to form data
<<<<<<< HEAD
      const {lat, lng} = window.mapView.newPin.getLatLng();
      const formdata = $form.serializeArray();
      formdata.push({name: "latitude", value: lat});
      formdata.push({name: "longitude", value: lng});
      formdata.push({name: "map_id", value: currentMap.id});
=======
>>>>>>> dev

      //const {lat, lng} = window.mapView.newPin.getLatLng();

      const longitude = Number($(this).closest('.new-pin-long').attr('id'));
      const latitude = Number($(this).closest('.new-pin-lat').attr('id'));
      const map_id = currentMap.id;
      const title = $(this).closest('#pin-Form').find('#new-pin-name').val();
      const description = $(this).closest('#pin-Form').find('#new-pin-desc').val();
      const img_url = $(this).closest('#pin-Form').find('#new-pin-name').val();

      let newPin = {longitude, latitude, map_id, title, description, img_url};

      addPin(newPin)
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

    const id = $(this).closest('#pin-Form').attr("value");
    const longitude = Number($(this).closest('.new-pin-long').attr('id'));
    const latitude = Number($(this).closest('.new-pin-lat').attr('id'));
    const map_id = currentMap.id;
    const title = $(this).closest('#pin-Form').find('#new-pin-name').val();
    const description = $(this).closest('#pin-Form').find('#new-pin-desc').val();
    const img_url = $(this).closest('#pin-Form').find('#new-pin-name').val();

<<<<<<< HEAD
    // reset editPin it's done it's work
    window.mapView.editPin.remove();
    window.mapView.editPin = null;
=======
    let newPin = {id, longitude, latitude, map_id, title, description, img_url};
>>>>>>> dev


    editPin(newPin)
      .then(result =>{
        getMapPins(`id=${currentMap.id}`).then(output => {
        //display pin list
        const pins = output;
        displayMapView(currentMap, 'editDetail');
      })
      .catch(e => console.log(e))
<<<<<<< HEAD

=======
>>>>>>> dev
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

//========collab events===================================================================================
  //add collab - update db and refresh collabList
  $mapView.on('click', '#addCollabBtn', function(event) {
    event.preventDefault();
    const username = $(this).closest('.new-collab-container').find('#new-collab-username').val();
    getUser(`username=${username}`).then(user => {
      if (user) {
        addCollaborator(`map_id=${currentMap.id}&user_id=${user.id}`)
        .then(output => displayCollabList());
      } else {
        alert('not a valid user!');
      }
    })
  });

  //delete collab - update db and refresh collabList
  $mapView.on('click', '.delete-collab-btn', function(event) {
    event.preventDefault();
    const userId = $(this).closest('.collab-item-container').attr('id');
    removeCollaborator(`map_id=${currentMap.id}&user_id=${userId}`)
    .then(output => displayCollabList());
  });

//========fav events==========================================================================================

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
});
