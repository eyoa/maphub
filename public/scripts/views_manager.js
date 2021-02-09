$(() => {

  const $main = $('#main_content');
  window.views_manager ={};

  const show = function(view){
    // or $main.empty?
    $mapList.detach();
    $registerForm.detach();
    $userProfile.detach();


    switch(view){
      case 'mapList':
        $mapList.appendTo($main);
        break;
      case 'login':
        break;
      case 'signUp':
        $registerForm.appendTo($main);
        break;
      case 'profile':
        $userProfile.appendTo($main);
        break;
      case 'mapDetails':
        break;
      case 'newMap':
          break;
      case 'editMap':
        break;

    }
  }
  window.views_manager.show = show;

});
