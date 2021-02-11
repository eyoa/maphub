$(() => {
  window.profileUserInfoItem = {};
  const createUserInfoItem = function (user, currentUser) {
    let editBtn = '';
    let emailDiv = '';

    if (currentUser.id === user.id) {
      editBtn = `<button class="btn btn-primary mx-auto" id="profile-edit-btn">edit</button>`;
      emailDiv = `<div id="email" class=""><label>Email: </label>${user.email}</div>`;
    }

    return `
      <div class="container d-flex flex-row justify-content-center" id="user-info-item">
        <div class="p-2">
          <img id="user-profile-img" src="${user.profile_img_url}" class="rounded img-thumbnail">
        </div>
        <div class="p-2 d-flex flex-column justify-content-center">

          <div id="username" >
            <label>Username: </label>
            ${user.username}
          </div>
          ${emailDiv}
          <div id="description" class="my-4">${user.description}</div>
          ${editBtn}
        </div>
      </div>
    </div>

    `;
  }

  const createEditProfileItem = function(user) {
    return `
      <div class="container" id="edit-profile-item">
        <form id="edit-user-profile">
          <div class="p-2 d-flex flex-row justify-content-center">

            <div class=" mw-25 mh-25">
              <img id="user-profile-img" src="${user.profile_img_url} class=" img-responsive img-thumbnail rounded">
            </div>

            <div class="p-2 d-flex flex-column justify-content-center">
              <div class="form-group">
                <label for="edit-username">new username: </label>
                <input type="text" class="form-control" id="edit-username" value="${user.username}">
              </div>

              <div class="form-group my-2">
                <label for="edit-email">new email: </label>
                <input type="email" class="form-control" id="edit-email" value="${user.email}">
              </div>
              <div class="form-group my-2">
                <label for="edit-description">new description: </label>
                <input type="text" class="form-control" id="edit-description" value="${user.description}">
              </div>

              <div class="form-group my-2">
                <label for="edit-profile-img">new profile image url: </label>
                <input type="url" class="form-control" id="edit-profile-img" value="${user.profile_img_url}">
                <button class='btn btn-primary my-3 mx-auto' id="refresh-profile-image">preview profile image</button>
              </div>

              <div class="my-2">
                <button type="submit" class="btn btn-primary mx-auto" id="save-profile-edit-changes">save changes</button>
                <button class="btn btn-primary mx-auto " id="cancel-profile-edit-changes">discard changes</button>
            </div>
          </div>


          </div>
        </form>
      </div>
    `;
  };

  window.profileUserInfoItem.createUserInfoItem = createUserInfoItem;
  window.profileUserInfoItem.createEditProfileItem = createEditProfileItem;
});
