$(() => {
  const createUserInfoItem = function (user, currentUser) {
    const editBtn = '';
    const emailDiv = '';
    const passwordDiv = '';

    if (currentUser.id === user.id) {
      editBtn = `<button class="btn btn-primary" id="profile-edit-btn">edit</button>`;
      emailDiv = `<div id="email">${user.email}</div>`;
      passwordDiv = `<div id="password">${user.password}</div>`;
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
            ${passwordDiv}
          </div>

        </div>
        <div id="description">${user.description}</div>
        ${editBtn}
      </div>
    `;
  }

  window.profileMapItem.createUserInfoItem = createUserInfoItem;
});
