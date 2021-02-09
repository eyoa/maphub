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
          <a class="nav-link active" href="/api/">Browse</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/map/?=">Map</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/users/?=">My Profile</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/maps/?=">My Maps</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/api/maps/?=">Favorites</a>
        </li>
      </ul>
    <ul class = "my-2 my-md-0">
      <a class="btn btn-primary my-2" href="/users/login" role="button">Login</a>
    </ul>

    </div>
  </nav>
  `;

  $navbar.append(navbarSnippet);

  // event listeners

  // for mini test view_manager
  $('navbar').on("click", function(event) {
    console.log('click detetected');
    console.log(event);


  });


});
