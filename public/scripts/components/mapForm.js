$(() => {
  window.mapForm ={};

  const createMapForm = function(map) {
    let titlePlaceholder = 'enter a title';
    let descPlaceholder = 'enter description';
    let btnId = 'quit-map-edit';
    let btnText = 'quit without saving';
    if (map) {
      titlePlaceholder = map.title;
      descPlaceholder = map.description;
      btnId = 'delete-map'
      btnText = 'delete map';
    }

    return `
      <form id="map-detailForm" class="my-2">
        <div class="form-group my-1">
          <label for="edit-map-title">map title</label>
          <input type="text" class="form-control my-1" id="edit-map-title" name="title" value="${titlePlaceholder}">
        </div>
        <div class="form-group my-1">
          <label for="edit-map-description">map description</label>
          <input type="text" class="form-control" id="edit-map-description" name="description" value="${descPlaceholder}">
        </div>
        <div class="form-group my-3">
          <button type="submit" class="btn btn-primary mx-1" id="save-continue-map-edit">save and continue</button>
          <button class="btn btn-primary mx-1" id="${btnId}">${btnText}</button>
        </div>
      </form>
    `;
  }

  window.mapForm.createMapForm = createMapForm;
});
