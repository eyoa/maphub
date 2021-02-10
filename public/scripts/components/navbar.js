$(() => {
  const $navbar = $('#navbar');

  let navbarSnippet = `
  <nav class="navbar navbar-expand-md navbar-light " style="background-color: #84a98c;">
    <a class="navbar-brand" href="/">
      <i class="fas fa-map"></i>
      MapHub
    </a>


    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMenu" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>


    <div class="collapse navbar-collapse " id="navbarMenu">
      <ul class = "navbar-nav mr-auto mt-2 mt-md-0"
        <li class="nav-item">
          <a class="nav-link active" href="/api/" id="nav-browse">Browse</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" href="/api/" id="nav-create-map">Create Map</a>
        </li>


        <li class="nav-item">
          <a class="nav-link" href="/api/map/?=" id="nav-mapDetails">Map</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/users/?=" id="nav-profile">My Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/maps/?=" id="nav-myMaps">My Maps</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/maps/?=" id="nav-myFavs">Favorites</a>
        </li>
      </ul>
    <ul class = "my-2 my-md-0">
      <a class="btn btn-primary my-2" href="/users/login" role="button" id="nav-login">Login</a>
    </ul>

    </div>
  </nav>
  `;

  $navbar.append(navbarSnippet);

  // event listeners

  // browse page for mini test view_manager
  $('#nav-browse').on("click", function(event) {
    event.preventDefault();

    getMapList()
      .then((data) =>{
        console.log("data is", data);
        mapList.addMapEntries(data);
        views_manager.show('mapList');
      })
      .catch(error => console.error(error));

  });

//================================================================
  $('#nav-create-map').on("click", function(event) {
    event.preventDefault();
    window.currentUser = 1;
    window.currentMap = null;
    window.currMapViewState = "editMap"
    $mapView.displayMapView(window.currentMap, window.currentUser, window.currMapViewState);
    views_manager.show('mapDetails');
  });
//=================================================================

  $('#nav-login').on("click", function(event) {
    event.preventDefault();
    views_manager.show('login');

  });


  $('#nav-mapDetails').on("click", function(event) {
    event.preventDefault();
    console.log('Lets go to mapDetails');
    // views_manager.show('login');

  });

  $('#nav-profile').on("click", function(event) {
    event.preventDefault();
    console.log('Lets go to profile ');
    // views_manager.show('login');
  });

  $('#nav-myMaps').on("click", function(event) {
    event.preventDefault();
    console.log('Lets go to myMaps ');
    // views_manager.show('login');
  });

  $('#nav-myFavs').on("click", function(event) {
    event.preventDefault();
    console.log('Lets go to myFavs ');
    // views_manager.show('login');
  });
});
