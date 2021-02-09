$(() => {
  mapViewHeader = {};
  const createMapHeader = function (map, currentUser, state, collabs) {
    let headerTitle = map.title;
    let headerButton = '';
    let favToggle = '';

    if (collabs.includes(currentUser)) {
      if (state === 'view') {
        headerTitle = map.title;
        headerButton = `<button class="btn btn-primary" id="edit-map">edit map</button>`;
        favToggle = '<div id="fav-toggle">⭐</div>';

      } else if (state === 'editMap') {
        headerTitle = map ? `Edit Map` : `Create Map`;
      } else {
        headerTitle = `Configure Map Details for ${map.title}`;
        headerButton = `<button class="btn btn-primary" id="exit-editor">exit-editor</button>`
      }
    }
    return `
      <div class="container row" id="map-header">
        <div class="row">
          <div class="col" id="header-title">${headerTitle}</div>
          <div class="row">
            ${favToggle}
            ${headerButton}
          </div>
        </div>
      </div>
    `;
  };

  window.mapViewHeader.createMapHeader = createMapHeader;
});
