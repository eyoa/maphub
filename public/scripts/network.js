function getMapList (params) {
  let url  = params ? "/maps?" + params : "/";
  return $.ajax({
    method: "GET",
    url
  });
}

function getMapDetails (params) {
  return $.ajax({
    method: "GET",
    url: "/map?" + params,
  });
}

function addMap(data) {
  return $.ajax({
    method: "PUT",
    url: "/map",
    data
  });
}

function editMap (params, data) {
  return $.ajax({
    method: "PATCH",
    url: "/map?" + params,
    data
  });
}

function removeMap (params) {
  return $.ajax({
    method: "DELETE",
    url: "/map?" + params,
  });
}

function getPinDetails (params) {
  return $.ajax({
    method: "GET",
    url: "/pin?" + params
  });
}

function addPin (data) {
  return $.ajax({
    method: "PUT",
    url: "/pin",
    data
  });
}

function editPin (params, data) {
  return $.ajax({
    method: "PATCH",
    url: "/pin?" + params,
    data
  });
}

function removePin (params) {
  return $.ajax({
    method: "DELETE",
    url: "/pin?" + params
  });
}

function getCollaborators (params) {
  return $.ajax({
    method: "GET",
    url: "/collaborators?" + params
  });
}

function addCollaborator (data) {
  return $.ajax({
    method: "PUT",
    url: "/collaborators",
    data
  });
}

function removeCollaborator (params) {
  return $.ajax({
    method: "DELETE",
    url: "/collaborators?" + params
  });
}
