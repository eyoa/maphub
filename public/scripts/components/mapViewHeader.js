$(() => {
  mapViewHeader = {};
  const createMapHeader = function (map, currentUser, state, collabs, favList) {

    if(!map) {
      return `
      <div class="container row" id="map-header">
        <div class="row">
          <div id="header-title">Create Map</div>
        </div>
      </div>
    `;
    }

    let headerTitle = map.title;
    let headerButton = '';
    let favToggle = '';

    console.log('collabs: ' , collabs);

    if (collabs.includes(currentUser)) {
      if (state === 'view') {
        headerTitle = map.title;
        headerButton = `<button class="btn btn-primary" id="edit-map">edit map</button>`;

        if (favList.includes(map.id)) {
          favToggle = `<img class="fav-Toggle" id="fav" src="./../../images/fav-sel.png" style="height:25px;">`
        } else {
          favToggle = `<img class="fav-Toggle" id="not-fav" src="./../../images/fav-unsel.png" style="height:25px;">`
        }

      } else if (state === 'editMap') {
        headerTitle = `Edit Map`;
      } else {
        headerTitle = `Configure Map Details for ${map.title}`;
        headerButton = `<button class="btn btn-primary" id="exit-editor">exit editor</button>`
      }
    }
    return `
      <div class="container row" id="map-header">
        <div class="row">
          <div id="header-title">${headerTitle}</div>
            ${favToggle}
            ${headerButton}
        </div>
      </div>
    `;
  };

  window.mapViewHeader.createMapHeader = createMapHeader;
});
