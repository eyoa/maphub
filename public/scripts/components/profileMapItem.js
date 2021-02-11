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
      changeButton = `<button class="btn btn-secondary mx-auto" id="${buttonId}">${buttonMsg}</button>`;
    }

    return `
      <div class="container user-map-item d-flex flex-row justify-content-center my-1 mx-auto" id="${map.id}">
          <div class=" d-flex flex-column mr-auto" id="map-title">${map.title}</div>
          <div class=" d-flex flex-column">
            ${changeButton}
          </div>
      </div>
    `;
  }

  window.profileMapItem.createMapItem = createMapItem;
});
