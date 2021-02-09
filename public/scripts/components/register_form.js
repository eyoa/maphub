$(() => {
  const $registerForm = $(`
  <form id="sign-up-form" class="sign-up-form">
    <p>Register</p>

    <div class="form-group">
      <label for="register-username">Username</label>
      <input type="text" class="form-control" id="register-username" placeholder="username" aria-describedby="username-help">
      <small id="username-help" class="form-text text-muted">Please enter a new username.</small>
    </div>

    <div class="form-group">
      <label for="register-email">Email Address</label>
      <input type="email" class="form-control" id="register-email" placeholder="example@email.com" aria-describedby="email-help">
      <small id="email-help" class="form-text text-muted">Please enter an email that will be associated with your new account.</small>
    </div>

    <div class="form-group">
      <label for="register-password">Password</label>
      <input type="password" class="form-control" id="register-password" placeholder="password" aria-describedby="password-help">
      <small id="password-help" class="form-text text-muted">Please enter a password *enter password requirements*</small>
    </div>

    <div class="form-group">
      <label for="register-verify-password">Verify Password</label>
      <input type="password" class="form-control" id="register-verify-password" placeholder="re-enter password" aria-describedby="verify-password-help">
      <small id="verify-password-help" class="form-text text-muted">Please verify your password.</small>
    </div>

    <div class="row">
      <div class="col">
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
      <div class="col">
        <button class="btn btn-primary" id="register-cancel">Cancel</button>
      </div>
    </div>
  </form>
  `);

  window.$registerForm = $registerForm;

  //on submit listener
  //on cancel listener
});
