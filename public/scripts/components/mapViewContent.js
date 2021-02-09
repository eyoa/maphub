$(() => {
  const $mapViewContent = $(`
    <div class="container row" id="map-content">
      <div class="container" id="map-content-header"></div>
      <div class="container" id="map-content-body"></div>
    </div>
  `);

  const $mapContentHeader = $(`#map-content-header`);
  const $mapContentBody = $(`#map-content-body`);

  const createPinListItem = function (pin) {

  };

  const createCollabListItem = function (collab) {

  };

  const insertList = function (items, itemType) {
    $mapContentBody.empty();
    $mapContentBody.append(`<div>All ${itemTyps}s</div>`);
    const $ListContainer = $(`<div class="container row" id="list-container"></div>`);
    for (const item of items) {
      if (itemType === 'pin') {
        $ListContainer.append(createPinListItem(item));
      } else {
        $ListContainer.append(createCollabListItem(item));
      }

    }
    $mapContentBody.append($pinListContainer);
  };



  const createMapContent = function (map, currentUser, state, pins, collaborators) {
    switch (state) {
      case 'view' :

        break;
      case 'editMap':

        break;
      case 'editDetail':

        break;
    }
    return $mapViewContent;
  }

  window.mapViewContent.createMapContent = createMapContent;
});
