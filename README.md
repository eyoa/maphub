# MapHub Project 

MapHub is a full stack single page web app that allowes users to create and have maps with different pins on it.


=========

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm run local` command to host on localhost.
- change the hostname or port in the .env file

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- pg-native
- Express
- ejs
- bcrypt
- body-parser
- cookie-session
- chalk
- dotenv
- node-sass-middleware

# Dev Dependencies
- morgan
- nodemon


# Features

## V1.0.0.0

### Public users
  * can view map and map list 
	* can access login and signup
	* can see pin list and popups 
	* can see collaborator list
	* cannot see collaborator profiles

### Login
  * The form doesn't allow blanks
  * checks for password properly
  * credentials are stored hashed
  
### signup 
  * The form doesn't allow blanks
  * The form doesn't allow you to send if verify password doesn't match password    

## Registered Users
* view map a map with pins
* correct list of maps shows up for example owned or favorites
* favorite star works 

# My profile 
* shows user details has access to edit details
* shows correct owned maps, favorite and collaborated maps list
* delete map button 
* stop collaborating 
* remove favorite

# My profile Edit
* can see the profile img display
* can edit details 
  * if username is changed the display changes after refresh or logout
  * if email credentials is changed user remains logged in, next login will require new credentials.
refresh or logout 
* Can preview profile img
* Can discard changes 

## viewing other users profiles
* Can view their details (limited info) 
* Can click on maps in their map lists and view that map

## View map
* Can favorite toggle map 
* Access to edit map
* Can view map with multiple pins and popups
* Can view list of all the pins associated with map
* Can see collaborator list
* Click on collaborator list to visit that users' profile view
	        
## Edit map
* Can favorite toggle map 
* Can set the map center and zoom level
* Can update title and desc as well 
* Can delete map 
       
## Edit Map Pt2
* Can favorite toggle map 
* Can add/remove collaborators
	* Checks for non-collaborators and doesn't allow you to add
	* Doesn't allow owner to be deleted
* pins can be removed/edited
* pins detials and co-ordinates can be edited
* pins can be added (via click hold, draggable)
	* no duplicate pin
  * pins with blank form cannot be submitted (no details)
