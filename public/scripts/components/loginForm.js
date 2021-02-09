$(() => {
  const $logInForm = $(`
  <form id="login-form" class="login-form">
    <div class="form-group">
      <label for="register-email">email</label>
      <input type="email" class="form-control" id="register-email" placeholder="example@email.com">
    </div>

    <div class="form-group">
      <label for="register-password">password</label>
      <input type="password" class="form-control" id="register-password" placeholder="password">
    </div>
    <button type="submit" class="btn btn-primary" id="login-btn">log in</button>
    <div>Not Registerd?</div>
    <div id="register-page-link">sign up!</div>
    </div>
  </form>
  `);

  window.$logInForm = $logInForm;

  //onclick listener for login button
  //onclick listener for signup
});
