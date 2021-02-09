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
      changeButton = `<button class="btn btn-secondary" id="${buttonId}">${changeCommand}</button>`;
    }

    return `
      <div class="container row" id="user-map-item">
          <div class="col">
            <img id="map-preview" src="${map.preview_img_url}">
          </div>
          <div class="col" id="map-owner">${map.title}</div>
          <div class="col">
            ${changeButton}
          </div>
      </div>
    `;
  }

  window.profileMapItem.createMapItem = createMapItem;
});
