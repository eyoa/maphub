$(() => {
  const $userProfile = $(`
  <div class="container" id="userProfile">
    <div class="container" id="user-info"></div>
    <p id="loading-message">fetching user map data...</p>
    <div>Maps owned by this user</div>
    <div class="container" id="user-maps-owned"></div>
    <div>Maps this user has collaborated in</div>
    <div class="container" id="user-maps-collaborated"></div>
    <div>Maps favourited by this user</div>
    <div class="container" id="user-maps-favourited"></div>
  </div>
  `);
  window.$userProfile = $userProfile;
  const $userInfoContainer = $userProfile.find(`#user-info`);
  const $mapsOwnedContainer = $userProfile.find(`#user-maps-owned`);
  const $mapsCollabContainer = $userProfile.find(`#user-maps-collaborated`);
  const $mapsFavContainer = $userProfile.find(`#user-maps-favourited`);

  const clearLoadingMessage = function () {
    $userProfile.find(`#loading-message`).remove();
  };

  const insertUserInfo = function(user, currentUser) {
    $userInfoContainer.empty();
    const userInfo = profileUserInfoItem.createUserInfoItem(user, currentUser);
    $userInfoContainer.append(userInfo);
  };

  const insertEditProfileForm = function(user) {
    $userInfoContainer.empty();
    const editForm = profileUserInfoItem.createEditProfileItem(user);
    $userInfoContainer.append(editForm);
  };

  const insertMapInfo = function (user, currentUser, mapCategory) {
    let params, $container;
    switch(mapCategory) {
      case 'owned':
        params = `owner_id=${user.id}`;
        $container = $mapsOwnedContainer;
        break;
      case 'collab':
        params = `collab_id=${user.id}`;
        $container = $mapsCollabContainer;
        break;
      case 'fav':
        params = `user_id=${user.id}`;
        $container = $mapsFavContainer;
        break;
    }

    $container.empty();
    getMapList(params)
    .then(output => {
      const mapList = output;
      for (const mapKey in mapList) {
        const map = mapList[mapKey];
        const mapItem = profileMapItem.createMapItem(map, user, currentUser, mapCategory);
        $container.append(mapItem);
      }
    });
  };

  const displayUserProfile = function (user, currentUser) {
      insertUserInfo(user, currentUser);
      clearLoadingMessage();
      insertMapInfo(user, currentUser, 'owned');
      insertMapInfo(user, currentUser, 'collab');
      insertMapInfo(user, currentUser, 'fav');
  };

  //on click listener for userprofile edit button, cancel edit ,and save changes
  $userProfile.on('click', '#profile-edit-btn', function(event) {
    event.preventDefault();
    getUserWithCookies().then(output => {
      const user = output.user;
      insertEditProfileForm(user);
    });
  });

  //on click listener for mapItems and buttons

  window.$userProfile.displayUserProfile = displayUserProfile;
});
