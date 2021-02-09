$(() => {
  const $userProfile = $(`
  <div class="container" id="userProfile">
    <div class="container" id="user-info"></div>
    <p id="loading-message">fetching user map data...</p>
    <div class="container" id="user-maps-owned">Maps owned by this user</div>
    <div class="container" id="user-maps-collaborated">Maps this user has collaborated in</div>
    <div class="container" id="user-maps-favourited">Maps favourited by this user</div>
  </div>
  `);
  window.$userProfile = $userProfile;
  $userInfoContainer = $(`#user-info`);
  $mapsOwnedContainer = $(`#user-maps-owned`);
  $mapsCollabContainer = $(`#user-maps-owned`);
  $mapsFavContainer = $(`#user-maps-owned`);

  const clearLoadingMessage = function () {
    $(`$loading-message`).remove();
  };

  const insertUserInfo = function(user, currentUser) {
    const userId = res.userId;
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
        params = '';
        $container = $mapsOwnedContainer;
        break;
      case 'collab':
        params = '';
        $container = $mapsCollabContainer;
        break;
      case 'fav':
        params = '';
        $container = $mapsFavContainer;
        break;
    }

    $container.empty();
    getMapList(/*params*/)
    .then(json => {
      const mapList = json.maps;
      for (const map in mapList) {
        const mapItem = profileMapItem.createMapItem(map, user, currentUser, mapCategory);
        $container.append(mapItem);
      }
    });
  };

  const displayUserProfile = function (user) {
    getCurrentUser()
    .then(res => {
      const currentUser = res.user;
      insertUserInfo(user, currentUser);
      clearLoadingMessage();
      insertMapInfo(user, currentUser, 'owned');
      insertMapInfo(user, currentUser, 'collab');
      insertMapInfo(user, currentUser, 'fav');
    });
  }

  //on click listener for userprofile edit button, cancel edit ,and save changes

  //on click listener for mapItems and buttons

  window.userProfile.displayUserProfile = displayUserProfile;
});
