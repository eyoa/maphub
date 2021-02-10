$(() => {
  window.profileUserInfoItem = {};
  const createUserInfoItem = function (user, currentUser) {
    let editBtn = '';
    let emailDiv = '';

    if (currentUser.id === user.id) {
      editBtn = `<button class="btn btn-primary" id="profile-edit-btn">edit</button>`;
      emailDiv = `<div id="email">${user.email}</div>`;
    }

    return `
      <div class="container" id="user-info-item">
        <div class="row">

          <div class="col">
            <img id="user-profile-img" src="${user.profile_img_url}">
          </div>

          <div class="col">
            <div id="username">username</div>
            ${emailDiv}
          </div>

        </div>
        <div id="description">${user.description}</div>
        ${editBtn}
      </div>
    `;
  }

  const createEditProfileItem = function(user) {
    return `
      <div class="container" id="edit-profile-item">
        <form id="edit-user-profile">
          <div class="row">

            <div class="col">
              <img id="user-profile-img" src="${user.profile_img_url}">

              <label for="edit-profile-img">new profile image url: </label>
              <input type="url" class="form-control" id="edit-profile-img" value="${user.profile_img_url}">
              <button class='btn btn-primary' id="refresh-profile-image">preview profile image</button>
            </div>

            <div class="col">
              <label for="edit-username">new username: </label>
              <input type="text" class="form-control" id="edit-username" value="${user.username}">

              <label for="edit-email">new email: </label>
              <input type="email" class="form-control" id="edit-email" value="${user.email}">
            </div>

          </div>
              <label for="edit-description">new description: </label>
              <input type="text" class="form-control" id="edit-description" value="${user.description}">

          <div class="row">
            <div class="col">
              <button type="submit" class="btn btn-primary" id="save-changes">save changes</button>
            </div>
            <div class="col">
              <button class="btn btn-primary" id="cancel-changes">discard changes</button>
            </div>
          </div>
        </form>
      </div>
    `;
  };

  window.profileUserInfoItem.createUserInfoItem = createUserInfoItem;
  window.profileUserInfoItem.createEditProfileItem = createEditProfileItem;
});
