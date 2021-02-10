$(() => {
  const $registerForm = $(`
  <article>
    <section class ="w-50 my-5 mx-auto"?>
      <form id="sign-up-form" class="sign-up-form">
        <p>Register</p>

        <div class="form-group">
          <label for="register-username">Username</label>
          <input type="text" class="form-control" id="register-username" name="username" placeholder="username" aria-describedby="username-help">
          <small id="username-help" class="form-text text-muted">Please enter a new username.</small>
        </div>

        <div class="form-group">
          <label for="register-email">Email Address</label>
          <input type="email" class="form-control" id="register-email" name="email" placeholder="example@email.com" aria-describedby="email-help">
          <small id="email-help" class="form-text text-muted">Please enter an email that will be associated with your new account.</small>
        </div>

        <div class="form-group">
          <label for="register-password">Password</label>
          <input type="password" class="form-control" id="register-password" name="password" placeholder="password" aria-describedby="password-help">
          <small id="password-help" class="form-text text-muted">Please enter a password *enter password requirements*</small>
        </div>

        <div class="form-group">
          <label for="register-verify-password">Verify Password</label>
          <input type="password" class="form-control" id="register-verify-password" placeholder="re-enter password" aria-describedby="verify-password-help">
          <small id="verify-password-help" class="form-text text-muted"  >Please verify your password.</small>
        </div>

        <div class="row">
          <div class="col">
            <button type="submit" id="registerBtn" class="btn btn-primary">Submit</button>
          </div>
          <div class="col">
            <a href="/users/login" class="btn btn-primary" id="register-cancel" role="button">Cancel</a>
          </div>
        </div>
      </form>
    </section>
  </article>
  `);

  window.$registerForm = $registerForm;

  $registerForm.on('click', "#registerBtn", function(event) {
    event.preventDefault();

    const form = $(this).closest('#sign-up-form');
    const username = form.find('#register-username').val();
    const email = form.find('#register-email').val();
    const verify = form.find('#register-verify-password').val();
    const pass = form.find('#register-password').val();


    if(!username || !email || !pass || !verify) {
      alert("fields cannot be empty");
    } else if(verify === pass){
      const data = form.serialize();
        register(data)
          .then(user => {
            window.navbar.updateNav(user.user);
            views_manager.show('mapList');
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        alert("verify password doesn't match");
      }

  });

  $registerForm.find('#register-cancel').on('click', function(event) {
    event.preventDefault();
    views_manager.show('login');
  });

});
