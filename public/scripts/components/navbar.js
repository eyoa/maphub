$(() => {
  const $navbar = $('#navbar');

  let navbarSnippet = `
  <nav class="navbar navbar-light " style="background-color: #84a98c;">
  <a class="navbar-brand" href="/">
    <i class="fas fa-map"></i>
    MapHub
    </a>
  <ul class="nav justify-content-center">
    <li class="nav-item">
      <a class="nav-link active" href="#">Browse</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Map</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Profile</a>
    </li>
  </ul>
    <ul class="navbar-nav ml-auto">
      <a class="btn btn-primary" href="/users/login" role="button">Login</a>
    </ul>


    <div class="btn-group">
  <button type="button" class="btn btn-info"> :)</button>
  <button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <span class="sr-only">Toggle Dropdown</span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item" href="#">Separated link</a>
  </div>
</div>

  </nav>

  `;

  $navbar.append(navbarSnippet);

});
