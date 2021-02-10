$(() => {
  const $logInForm = $(`
    <article >
      <section class="w-50 mx-auto">
        <div class="alert alert-warning alert-dismissible h-auto " role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <form id="login-form" class="login-form" action="/users/login" method="POST">
          <div class="form-group">
            <label for="register-email">email</label>
            <input type="email" class="form-control" id="login-email" placeholder="example@email.com" name="email">
          </div>

          <div class="form-group">
            <label for="register-password">password</label>
            <input type="password" class="form-control" id="login-password" placeholder="password" name="password">
          </div>
          <button type="submit" class="btn btn-primary" id="login-btn">log in</button>
          <div>Not Registerd?</div>
            <a href="/users/register" id="register-page-link">sign up!</a>
          </div>
        </form>
      </section>
    </article>
  `);

  window.$logInForm = $logInForm;

  $logInForm.on('submit', '#login-form', function(event) {
    event.preventDefault();
    const $alert = $(this).siblings(".alert");
    const email = $(this).find("#login-email").val();
    const pass = $(this).find("#login-password").val();

    if(!email || !pass){
      $alert.val() = "fields blank";
      $(this).closest(".alert").alert();
    } else {
      const data = $(this).serialize();
      logIn(data)
        .then(user => {
          if (!user.user){
            alert("login invalid");
            window.navbar.updateNav();
            views_manager.show('login');
            return;
          }
          console.log("back in event handler");
          window.navbar.updateNav(user.user);
          views_manager.show('mapList');
        })
        .catch((e) => {
          console.log(e);
        });
    }


  });

  $logInForm.on('click', '#register-page-link', function(event) {
    event.preventDefault();
    views_manager.show('signUp');
  });

});
