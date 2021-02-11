$(() => {
  window.profileMapItem = {};
  const createMapItem = function (map, user, currentUser, mapCategory) {
    let changeButton = '';
    let buttonMsg;
    let buttonId;
    if (currentUser.id === user.id) {
      switch (mapCategory) {
        case 'owned':
          buttonMsg = 'delete map';
          buttonId = 'remove-map';
          break;
        case 'collab':
          buttonMsg = 'stop collaborating';
          buttonId = 'remove-collab';
          break;
        case 'fav':
          buttonMsg = 'remove from favorites';
          buttonId = 'remove-fav';
          break;
      }
      changeButton = `<button class="btn btn-secondary" id="${buttonId}">${buttonMsg}</button>`;
    }

    return `
      <div class="container row user-map-item" id="${map.id}">
          <div class="col" id="map-title">${map.title}</div>
          <div class="col">
            ${changeButton}
          </div>
      </div>
    `;
  }

  /**
   *
   *      <div class="col">
            <img id="map-preview" src="${map.preview_img_url}">
          </div>
   *
   */
  window.profileMapItem.createMapItem = createMapItem;
});
