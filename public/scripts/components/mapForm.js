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
      <form id="map-detailForm">

        <label for="edit-map-title">map title</label>
        <input type="text" class="form-control" id="edit-map-title" name="title" value="${titlePlaceholder}">

        <label for="edit-map-description">map description</label>
        <input type="text" class="form-control" id="edit-map-description" name="description" value="${descPlaceholder}">
        <button type="submit" class="btn btn-primary" id="save-continue-map-edit">save and continue</button>
        <button class="btn btn-primary" id="${btnId}">${btnText}</button>
      </form>
    `;
  }

  window.mapForm.createMapForm = createMapForm;
});
