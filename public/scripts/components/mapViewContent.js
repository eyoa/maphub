$(() => {
  const createMapContent = function (map, currentUser, state) {


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

  window.mapViewContent.createMapContent = createMapContent;
});
