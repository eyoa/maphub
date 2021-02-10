$(() => {
  const $logInForm = $(`
    <article >
      <section class="w-50 my-5 mx-auto">
        <form id="login-form" class="login-form" action="/users/login" method="POST">
          <div class="form-group">
            <label for="register-email">email</label>
            <input type="email" class="form-control" id="register-email" placeholder="example@email.com" name="email">
          </div>

          <div class="form-group">
            <label for="register-password">password</label>
            <input type="password" class="form-control" id="register-password" placeholder="password" name="password">
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

  $logInForm.on('submit', function(event) {
    event.preventDefault();
    const data = $(this).find('#login-form').serialize();
    logIn(data)
      .then(json => {
        console.log("back in event handler", json);
        views_manager.show('mapList');
      })
      .catch(() => {

      });
  });

  $logInForm.find('#register-page-link').on('click', function(event) {
    event.preventDefault();
    views_manager.show('signUp');
  });

});
