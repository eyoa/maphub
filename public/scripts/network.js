// users ajax requests
const logIn = function(data) {
  return $.ajax({
    method: 'PUT',
    url: "/users/login/",
    dataType: 'json',
    data: data
  });
};

const logOut = function() {
  return $.ajax({
    method: "PUT",
    url: "/users/logout",
  });
};

const register = function(data) {
  return $.ajax({
    method: "PUT",
    url: "/users/register",
    data
  });
};

const getUserWithCookies = function(){
  return $.ajax({
    method: "GET",
    url: "/users/currentUser"
  })
}

const getUser = function(params) {
  // params sent in url query like an api
  let url = "/users/";
  url += "?" + params;
  return $.ajax({
    method: "GET",
    url
  });
};

const updateUser = function(data) {
  let url = "/users/";
  return $.ajax({
    method: "PUT",
    url,
    data
  })
};


//  api ajax requests

function getMapList(params) {
  console.log("checking the params to getMaplist", params);
  let url  = params ? "/api/maps?" + params : "/api/maps";
  return $.ajax({
    method: "GET",
    url
  })
}

function getMapById(params) {
  return $.ajax({
    method: "GET",
    url: "/api/map/info?" + params,
  });
}

function getMapDetails(params) {
  return $.ajax({
    method: "GET",
    url: "/api/map/details?" + params,
  });
}

function addMap(data) {
  return $.ajax({
    method: "PUT",
    url: "/api/map",
    data
  });
}

function editMap(data) {
  return $.ajax({
    method: "PATCH",
    url: "/api/map",
    data
  });
}

function removeMap(data) {
  console.log(data);
  return $.ajax({
    method: "DELETE",
    url: "/api/map",
    data
  });
}

function getMapPins(params) {
  return $.ajax({
    method: "GET",
    url: "/api/map/pin?" + params
  });
}

function getPinDetails(params) {
  return $.ajax({
    method: "GET",
    url: "/api/pin?" + params
  });
}

function addPin(data) {
  return $.ajax({
    method: "PUT",
    url: "/api/pin",
    data
  });
}

function editPin(data) {
  return $.ajax({
    method: "PATCH",
    url: "/api/pin",
    data
  });
}

function removePin(data) {
  return $.ajax({
    method: "DELETE",
    url: "/api/pin",
    data
  });
}

function getCollaborators(params) {
  return $.ajax({
    method: "GET",
    url: "/api/collaborators?" + params
  });
}

function addCollaborator(params) {
  return $.ajax({
    method: "PUT",
    url: "/api/collaborators?" + params,
  });
}

function removeCollaborator(params) {
  return $.ajax({
    method: "DELETE",
    url: "/api/collaborators?" + params
  });
}

function addFav(params) {
  return $.ajax({
    method: "PUT",
    url: "/api/fav?" + params
  });
}

function removeFav(params) {
  return $.ajax({
    method: "DELETE",
    url: "/api/fav?" + params
  });
}
