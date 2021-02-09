$(() => {

  const $main = $('#main_content');
  window.views_manager ={};

  const show = function(view){
    // or $main.empty?
    // $mapList.detach();
    // $registerForm.detach();
    // $userProfile.detach();

    $(`<p>append is working fine</p>`).appendTo($main);

    switch(view){
      case 'mapList':
        console.log($main);
        console.log("mapList has ", $mapList);
        // $mapList.appendTo($('main-content'));
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
