$(() => {
  const $navbar = $('#navbar');

  let navbarSnippet = `
  <nav class="navbar navbar-light " style="background-color: #84a98c;">
  <a class="navbar-brand" href="/">
    <i class="fas fa-map"></i>
    MapHub
    </a>
    <ul class="navbar-nav ml-auto">
      <button type="button" class="btn btn-info">Login</button>
    </ul>

  </nav>

  `;

  $navbar.append(navbarSnippet);

});
