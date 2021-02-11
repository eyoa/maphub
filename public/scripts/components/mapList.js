$(() => {
  window.mapList = {};

  const $mapList = $(`
  <section class="map-list " id="map-list">
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

  //===============================
  // initializing global var
  window.currentMap = {};
  //===============================

  //on click listener for clicking on map item
  $mapList.on('click','#view-map', function(event) {
    event.preventDefault();
    const mapId = $(this).closest(".mapEntry").attr('id');
    getMapById(`id=${mapId}`)
    .then((output) => {
      const map = output;
      window.currentMap = map;
      currentState = 'view';

      window.mapView.displayMapView(map, 'view');
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

  window.mapList.addMapEntries = addMapEntries;
});
