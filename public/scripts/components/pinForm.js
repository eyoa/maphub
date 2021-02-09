$(() => {
  window.pinForm = {};

  // isNew is boolean to differentiate if a new pin is being created or editing existing info
  // 2 hidden input fields for longitude and latitude values for pin creation/editing
  // the form currently has 2 submit buttons... set a value on them
  // but will need code to deifferentiate the two and remove that key value pair before sending params
  const createForm = function(isNew = false) {
    return `
    <article class="pinForm">
      <section class="d-flex justify-content-center my-3">
        <form action="/api/pin" method="">
          <input type="hidden" name="longitude" value="" hidden>
          <input type="hidden" name="latitude" value="" hidden>

          <div class="form-group">
            <label for="pin-title">Name</label>
            <input type="text" name="title" class="form-control" placeholder="Enter place name">
          </div>
          <div class="form-group">
            <label for="pin-description">Description</label>
            <input type="text" name="description" class="form-control" placeholder="Describe this location">
          </div>
          <div class="form-group">
            <label for="pin-img_url">Location Image</label>
            <input type="url" name="img_url" class="form-control" placeholder="http://">
          </div>

          ${isNew ?
            `<button type="submit" class="btn btn-primary" name="btnMethod" value="put">Add Pin!</button>`
            : `<button type="submit" class="btn btn-primary" name="btnMethod" value="patch">Save Changes</button>
               <button type="submit" class="btn btn-danger" name="btnMethod" value="delete">Cancel Edit</button>`}

        </form>
      </section>
    </article>
    `;
  };

  window.pinForm.createForm = createForm;
});

  // function for making pin form html
  // const pinForm = function() {
  //   clearList();
  //   const entry = window.pinForm.createForm(true);
  //   $mapList.append(entry);

  // };

  // $main.append($mapList);
  // pinForm();
