! -home page should show something 

user auth
 - login works
 - signup link works
 - user creation (sign up) activity works
 - logout works
! - maybe have a sign up button?  
! - sign up validation: check for unique username and unique email

profile
  - edit button displays edit profile form correclty
  - preview image works
  - discard changes works
  - save changes works
! - when saving changes check for unique username and unique email

  - owned map, collaborated map, favourited map all shows
! - clicking on the map doesnt send you to mapView anymore
  - favlist correctly updates
  - collablist correctly updates 
  - ownedmap correctly updates

VIEWS

  logged in

! - navbar username goes to undefined if you refresh page
! - fav star should show even if youre not a collaborator (when viewing map)
  - fav star correctly updates
 
 browse -> mapview -> edit flow
  - pin list collab list works fine
  - edit remove add pin works fine
! - add delete collaborator does everything intended twice
  - delete map works fine

createmap -> save & continue ->edit flow
!  - pin list and collab list buttons dont work as intended
!  - pin form seems to be bugging out a bit 
!  - exit editor button not present
   - quit without saving works

  logged out

- browse displays correctly (no fav star)

- all other links redirect to login 
  - excpet create map -> maybe it thsould redirect to login too

-view map shows no fav star, no edit button
  -pin list collab list funcitons as it should
  -pin list clicked shows pin list detail

! -collab list click -> sends you to user object... maybe have this sent to user profile
! -map button doesnt do anything -> get rid of it?
! -my maps can redirect to clone of the map lists @ my profile i think
!- we can get rid of favourites tab



