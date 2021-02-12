$(() => {
  mapViewHeader = {};
  const createMapHeader = function (map, currentUser, state, collabs, favList) {

    if(!map) {
      return `
      <div class="container mt-5 d-flex flex-row" id="map-header">
        <h3 id="header-title">Create Map</h3>
      </div>
    `;
    }

    let headerTitle = map.title;
    let headerButton = '';
    let favToggle = '';

    if (currentUser && state === 'view') {
      if (favList.includes(map.id)) {
        favToggle = `<img class="fav-Toggle mx-2" id="fav" src="./../../images/fav-sel.png" style="height:25px;">`
      } else {
        favToggle = `<img class="fav-Toggle mx-2" id="not-fav" src="./../../images/fav-unsel.png" style="height:25px;">`
      }
    }

    if (collabs.includes(currentUser)) {
      if (state === 'view') {
        headerTitle = map.title;
        headerButton = `<button class="btn btn-primary ml-auto flex-end" id="edit-map">edit map</button>`;
      } else if (state === 'editMap') {
        headerTitle = `Edit Map`;
      } else {
        headerTitle = `Configure Map Details for ${map.title}`;
        headerButton = `<button class="btn btn-secondary ml-auto flex-end" id="exit-editor">exit editor</button>`
      }
    }

    return `
      <div class="container row mt-5 d-flex flex-row" id="map-header">
          <h3 id="header-title">${headerTitle}</h3>
            ${favToggle}
            ${headerButton}
      </div>
    `;
  };

  window.mapViewHeader.createMapHeader = createMapHeader;
});
