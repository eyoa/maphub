const { addUser } = require("../../../server/database");

$(() => {
  const $mapViewContent = $(`
    <div class="container row" id="map-content">
      <div class="container" id="map-content-header"></div>
      <div class="container" id="map-content-body"></div>
    </div>
  `);

  const $mapContentHeader = $(`#map-content-header`);
  const $mapContentBody = $(`#map-content-body`);

  const insertContentHeader = function (map, currentUser, state) {
    $mapContentHeader.empty();
    const $pinCollabToggle = $(`
      <button class="btn btn-primary" id="get-pin-list">pin list</button>
      <button class="btn btn-primary" id="get-collab-list">collaborator list</button>
    `);
    const $searchOnMapForm = $(`
      <form id="searchOnMapForm">
        <div class="row">
          <div class="col">
            <input type="text" class="form-control" placeholder="search for a region of interest">
          </div>
          <div class="col">
            <button type="submit">🔎</button>
          </div>
        </div>
      </form>
    `);
    if (state === "view") {
      $mapContentHeader.append($pinCollabToggle);
    } else if (state === 'editMap') {
      $mapContentHeader.append($searchOnMap);
    } else if (currentUser.id === map.owner_id) {
      $mapContentHeader.append($pinCollabToggle);
    }
  };

  const insertContentBody = function (contentType, contentData, state) {
    $mapContentBody.empty();
    let $content;
    switch(contentType){
      case "pinList":
        $content = pinlist.createPinList(contentData, state);
        break;
      case "collabList":
        $content = collabList.createCollabList(contentData, state);
        break;
      case "pinForm":
        $content = pinForm.createForm(contentData); //pinForm not state dependent
        break;
      case "mapForm":
        $content = mapForm.createMapForm(contentData); //mapForm not state dependent
        break;
    }
    $mapContentBody.append($content);
  }

  const createMapContent = function (map, currentUser, state, contentType, contentData) {
    insertContentHeader(map, currentUser, state);
    insertContentBody(contentType, contentData, state);
  }

  window.mapViewContent.createMapContent = createMapContent;
});
