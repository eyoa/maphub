$(() => {

  const $main = $('#main_content');
  window.views_manager = {};

  // $main.append('<p>Will implement a intial state sometime</p>');

  const show = function(view) {
    $mapList.detach();
    $logInForm.detach();
    $registerForm.detach();
    $userProfile.detach();
    $mapView.detach();

    switch (view) {
    case 'mapList':
      $mapList.appendTo($main);
      break;
    case 'login':
      $logInForm.appendTo($main);
      break;
    case 'signUp':
      $registerForm.appendTo($main);
      break;
    case 'profile':
      $userProfile.appendTo($main);
      break;
    case 'mapDetails':
      $mapView.appendTo($main);
      break;
    case 'newMap':
      break;
    case 'editMap':
      break;

    }
  };
  window.views_manager.show = show;

});
