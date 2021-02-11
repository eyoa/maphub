$(() => {
  const $logInForm = $(`
    <article >
      <section class="w-50 my-5 mx-auto">
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

  $logInForm.on('click', '#login-btn', function(event) {
    const $loginForm = $(this).closest('#login-form');
    event.preventDefault();
    const email = $loginForm.find("#login-email").val();
    const pass = $loginForm.find("#login-password").val();

    if(!email || !pass){
      alert("fields blank");
    } else {
      const data = $loginForm.serialize();
      logIn(data)
        .then(user => {
          if (!user.user){
            alert("login invalid");
            window.navbar.updateNav();
            views_manager.show('login');
            return;
          }
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
