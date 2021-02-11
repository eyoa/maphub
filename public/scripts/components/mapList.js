$(() => {
  window.mapList = {};

  const $mapList = $(`
  <section class="map-list" id="map-list">
    <p>Loading...</p>
  </section>
  `);

  window.$mapList = $mapList;

  function clearList() {
    $mapList.empty();
  }

  const addMapEntries = function(data) {
    clearList();
    getUserWithCookies()
    .then(output => {
      const currUser = output.user;
      if(currUser) {
        getMapList(`user_id=${currUser.id}`)
        .then(output => {
          const mapList = output;
          const favList = [];
          for(const mapKey in mapList) {
            favList.push(mapList[mapKey].id);
          }
          for (const mapRow of data) {
            const entry = window.mapEntry.createMapEntry(mapRow, favList);
            $mapList.append(entry);
          }
        });
      } else {
        for (const mapRow of data) {
          const entry = window.mapEntry.createMapEntry(mapRow, null);
          $mapList.append(entry);
        }
      }
    });
  };

  window.mapList.addMapEntries = addMapEntries;
  //===============================
  // initializing global vars
  window.currentMap = {};
  window.currentUser = null;
  //===============================

  //on click listener for clicking on map item
  $mapList.on('click','#view-map', function(event) {
    const mapId = $(this).closest(".mapEntry").attr('id');

    event.preventDefault();
    Promise.all([getMapById(`id=${mapId}`), getUserWithCookies()])
    .then((output) => {
      const map = output[0];
      const currUser =  output[1] ? output[1].user.id : null;

      window.currentUser = currUser;
      window.currentMap = map;
      currentState = 'view';


      window.$mapView.displayMapView(map, currentUser, 'view');
      window.views_manager.show('mapDetails');
    })
  });

  //onclick listners for fav toggles
  $mapList.on('click', '.fav-Toggle', function(event){
    event.preventDefault();

    elementId = $(this).attr('id');
    mapId = $(this).closest(".mapEntry").attr("id");

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

});
