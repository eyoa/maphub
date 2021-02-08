// users ajax requests

const logIn = function(data) {
  return $.ajax({
    method: "PUT",
    url: "/users/login",
    data
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


const getProfile = function(params) {
  // params sent in url query like an api
  let url = "/users/";
  url += "?" + params;
  return $.ajax({
    method: "GET",
    url
  });
};

const updateUser = function(data) {
  return $.ajax({
    method: "PUT",
    url,
    data
  });
};


//  api ajax requests

function getMapList(params) {
  let url  = params ? "/api/maps?" + params : "/api/";
  return $.ajax({
    method: "GET",
    url
  });
}

function getMapDetails(params) {
  return $.ajax({
    method: "GET",
    url: "/api/map?" + params,
  });
}

function addMap(data) {
  return $.ajax({
    method: "PUT",
    url: "/api/map",
    data
  });
}

function editMap(params, data) {
  return $.ajax({
    method: "PATCH",
    url: "/api/map?" + params,
    data
  });
}

function removeMap(params) {
  return $.ajax({
    method: "DELETE",
    url: "/api/map?" + params,
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

function editPin(params, data) {
  return $.ajax({
    method: "PATCH",
    url: "/api/pin?" + params,
    data
  });
}

function removePin(params) {
  return $.ajax({
    method: "DELETE",
    url: "/api/pin?" + params
  });
}

function getCollaborators(params) {
  return $.ajax({
    method: "GET",
    url: "/api/collaborators?" + params
  });
}

function addCollaborator(data) {
  return $.ajax({
    method: "PUT",
    url: "/api/collaborators",
    data
  });
}

function removeCollaborator(params) {
  return $.ajax({
    method: "DELETE",
    url: "/api/collaborators?" + params
  });
}
