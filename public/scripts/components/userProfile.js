$(() => {
  const $userProfile = $(`
  <div class="container my-5 " id="userProfile">
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

  window.$userProfile.displayUserProfile = displayUserProfile;

  /////////////////////profile edit on click listeners ///////////////////////////////////////////////
  //show edit profile form
  $userProfile.on('click', '#profile-edit-btn', function(event) {
    event.preventDefault();
    getUserWithCookies().then(output => {
      const user = output.user;
      insertEditProfileForm(user);
    });
  });

  //updates display for profile image
  $userProfile.on('click', '#refresh-profile-image', function(event) {
    event.preventDefault();
    const newUrl = $(this).closest('.col').find('#edit-profile-img').val();
    const imgElement = $(this).closest('.col').find('#user-profile-img');
    console.log(newUrl);
    console.log(imgElement);
    imgElement.attr('src', newUrl);
  });

  //save changes and edit profile & refresh display
  $userProfile.on('click', '#save-profile-edit-changes', function(event) {
    event.preventDefault();
    getUserWithCookies().then(output => {
      const id = output.user.id;

      $form = $(this).closest('#edit-user-profile');
      const username = $form.find('#edit-username').val();
      const email = $form.find('#edit-email').val();
      const description = $form.find('#edit-description').val();
      const profile_img_url = $form.find('#edit-profile-img').val();

      const user = {id, username, email, description, profile_img_url};
      updateUser(user)
      .then(updatedUser => {
        console.log(updatedUser);
        insertUserInfo(updatedUser, updatedUser);
      });
    });
  });

  //just go to original profile view
  $userProfile.on('click', '#cancel-profile-edit-changes', function(event) {
    event.preventDefault();
    getUserWithCookies().then(output => {
      const user = output.user;
      insertUserInfo(user, user);
    });
  });

  ////////////////////user map edit on click listeners//////////////////////////////////////////////

  //clicking title will send you to mapView
  $userProfile.on('click', '#map-title', function(event){
    event.preventDefault();
    mapId = $(this).closest('.user-map-item').attr('id');
    Promise.all([getMapById(`id=${mapId}`), getUserWithCookies()])
    .then(output => {
      const map = output[0];
      currentUser = output[1].user.id;
      currentMap = map;
      currentState = 'view';
      window.$mapView.displayMapView(map, 'view');
      window.views_manager.show('mapDetails');
    })
  });

  //delete map
  $userProfile.on('click', '#remove-map', function(event){
    event.preventDefault();
    const id = $(this).closest('.user-map-item').attr('id');

    getUserWithCookies()
    .then(output=> {
      currentUser = output.user;
      console.log("mapid is", id);
      removeMap({id})
      .then(result =>{
        console.log('deleted!');
        insertMapInfo(currentUser, currentUser, 'owned');
      })
    })
    .catch(e => console.error);

  });

  //stop collaborating
  $userProfile.on('click', '#remove-collab', function(event){
    event.preventDefault();
    const mapId = $(this).closest('.user-map-item').attr('id');
    getUserWithCookies()
    .then(output=> {
      currentUser = output.user;
      removeCollaborator(`map_id=${mapId}&user_id=${currentUser.id}`)
      .then(res => {
        insertMapInfo(currentUser, currentUser, 'collab');
      });
    });
  });

  //remove from fav
  $userProfile.on('click', '#remove-fav', function(event){
    event.preventDefault();
    const mapId = $(this).closest('.user-map-item').attr('id');
    getUserWithCookies()
    .then(output=> {
      currentUser = output.user;
      removeFav(`map_id=${mapId}&user_id=${currentUser.id}`)
      .then(res => {
        insertMapInfo(currentUser, currentUser, 'fav');
      });
    });
  });

});
