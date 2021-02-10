$(() => {
  mapViewHeader = {};
  const createMapHeader = function (map, currentUser, state, collabs) {
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

    if (collabs.includes(currentUser)) {
      if (state === 'view') {
        headerTitle = map.title;
        headerButton = `<button class="btn btn-primary" id="edit-map">edit map</button>`;
        favToggle = '<div id="fav-toggle">⭐</div>';

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
