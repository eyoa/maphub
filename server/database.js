const pool = require('./lib/pool');
const {
  getActiveKeys,
  getObjWithoutId,
} = require('./qHelpers');


// user queries // ------------------------------------------------------------------------------------
const getUser = function(user) {
  const queryParams = [];
  let queryStr = `
    SELECT *
    FROM users
    WHERE
  `;

  const keys = getActiveKeys(user);

  if (keys.includes('id')) {
    queryParams.push(user.id);
    queryStr += ` id = $${queryParams.length}`;
  }

  if (keys.includes('email')) {
    queryParams.push(user.email);
    queryStr += `email = $${queryParams.length}`;
  }

  if (keys.includes('username')) {
    queryParams.push(user.username);
    queryStr += `username = $${queryParams.length}`;
  }

  queryStr += ';';

  return pool.query(queryStr, queryParams)
    .then(data => {
      return data.rows[0];
    })
    .catch(e => console.log("get user error", e));
};
exports.getUser = getUser;

const setUser = function(user) {
  const copyWithoutId = getObjWithoutId(user);
  const userAttr = ['username', 'email', 'description', 'profile_img_url'];
  const queryParams = [user.id];

  let queryStr = `
    UPDATE users
    SET
  `;

  let counter = 0;
  for (let key in copyWithoutId) {
    let val = copyWithoutId[key];
    queryStr += counter === 0 ? ` ${key} = $${counter + 2} ` : ` ,${key} = $${counter + 2} `;
    queryParams.push(val);
    counter++;
  }
  queryStr +=
  `
    WHERE id = $1
    RETURNING *;
  `;

  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.setUser = setUser;

const addUser = function(user) {
  let queryStr = `
    INSERT INTO users (${Object.keys(user)})
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const queryParams = [];
  for (let key in user) {
    queryParams.push(user[key]);
  }

  return pool.query(queryStr, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("add user error", e));
};
exports.addUser = addUser;




// ------ api queries ----------------------------------------------

// 1) returns all maps
// 2) returns favorited maps
// 3) returns owned maps
// *** owner_id is for owned maps and user_id is for favorite maps
const getMapList = (params) => {
  const queryParams = [];
  let queryString = `
  SELECT DISTINCT maps.id, maps.title, maps.description
  FROM maps
  `;

  const keys = getActiveKeys(params);

  if (keys.includes('user_id')) {
    //favorites list
    queryParams.push(params['user_id']);
    queryString += `
    JOIN favorites ON maps.id = favorites.map_id
    WHERE favorites.user_id = $${queryParams.length}
    `;

  } else if (keys.includes('collab_id')) {
    queryParams.push(params['collab_id']);
    queryString += `
    JOIN collaborators ON maps.id = collaborators.map_id
    WHERE collaborators.user_id = $${queryParams.length}
    AND maps.owner_id != $${queryParams.length}
    `;

    // console.log('params is: ' , params);
    // console.log("queryString is ", queryString);

  } else if (keys.includes('owner_id')) {
    // owned maps list
    queryParams.push(params['owner_id']);
    queryString += `WHERE owner_id = $${queryParams.length}
    `;
  }

  queryString += `ORDER BY maps.id;`;

  return pool.query(queryString, queryParams)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Map query error", e));
};
exports.getMapList = getMapList;

const getMapById = function(map){
  let queryStr = `
    SELECT *
    FROM maps
    WHERE id = $1;
  `;

  const queryParams = [map.id];
  return pool.query(queryStr, queryParams)
  .then(res => res.rows[0]);
}
exports.getMapById = getMapById;

// only allow map detail query based on id
// this might be specific case for getMapList
const getMapDetails = function (map) {
  let queryStr = `
    SELECT
      m.id AS map_id, m.latitude AS map_latitude, m.longitude AS map_longitude, m.title AS map_title, m.zoom_lv, m.description AS map_description, m.owner_id,
      p.id AS pin_id, p.title AS pin_description, p.img_url, p.latitude AS pin_latitude, p.longitude AS pin_longitude
    FROM maps m JOIN pins p ON p.map_id = m.id
    WHERE m.id = $1;
  `;
  const queryParams = [map.id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows);
};
exports.getMapDetails = getMapDetails;

const addMap = function(mapParams) {
  console.log("in add map query db mapParams are", mapParams);
  const params = [];
  let queryString = `INSERT INTO maps (`;

  const keys = Object.keys(mapParams);
  for (const key of keys) {
    queryString += key;
    if (keys.indexOf(key) ===  keys.length - 1) {
      queryString +=  `) `;
    } else {
      queryString +=  `, `;
    }
  }
  queryString +=  `VALUES (`;

  for (const key of keys) {
    // check to push correct type to db
    const numRegex = new RegExp("^[1-9]\d*(\.\d+)?$", "gm");
    if (typeof mapParams[key] === 'string' && numRegex.test(mapParams[key])) {
      params.push(Number(mapParams[key]));
    } else {
      params.push(mapParams[key]);
    }

    if (keys.indexOf(key) ===  keys.length - 1) {
      queryString += `$${params.length} ) `;
    } else {
      queryString += `$${params.length}, `;
    }
  }

  queryString += `RETURNING *;`;

  console.log("addMap query is ", queryString);
  console.log("addMap parameters ", params);

  return pool.query(queryString, params)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Map create error", e));
};
exports.addMap = addMap;


// update entry in map table
//mapParams is an object with key values pairs matching db
const updateMap = function(mapParams) {

  const updateParams = [];
  let updateString = `UPDATE maps SET `;

  const keys = getActiveKeys(mapParams);
  console.log(keys);

  for (const key of keys) {
    if (key !== 'id') {

      updateParams.push(mapParams[key]);
      updateString += key + ' = ' + `$${updateParams.length}`;

      // keys.length -2 to account for the id key
      if (keys.indexOf(key) !==  keys.length - 2) {
        updateString +=  `, `;
      }
    }

  }

  updateParams.push(mapParams['id']);
  updateString += ` WHERE id = $${updateParams.length} `;
  updateString += `RETURNING *;`;

  console.log("updateMap query is ", updateString);
  console.log("updateMap parameters ", updateParams);

  return pool.query(updateString, updateParams)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Map update error", e));
};
exports.updateMap = updateMap;


// remove a map
//mapParams is an object with key values pairs (needs for map id)
const removeMap = function(mapParams) {
  console.log(mapParams);
  const paramMapid = [];
  let removeQuery = '';
  // to ensure there is a valid condition before sending remove query
  // console.log(mapParams.id);

  if (mapParams.id) {
    paramMapid.push(mapParams.id);
    removeQuery = `
    DELETE FROM maps
    WHERE id = $1
    RETURNING *;
    `;
  }

  console.log("removeMap query is ", removeQuery);
  console.log("map id to remove is ", paramMapid);

  return pool.query(removeQuery, paramMapid)
    .then(data => {
      // console.log(data);
      return data.rows;
    })
    .catch(e => console.log("Map remove error", e));
};
exports.removeMap = removeMap;

// TEST CODE
// removeMap({id : 2 });


// get pin details columns other than longtitude and latitude
//mapParams is an object with key values pairs (needs pin id)

const getMapPins = function(map) {
  let queryStr = `
    SELECT p.*
    FROM maps m JOIN pins p ON m.id = p.map_id
    WHERE m.id = $1
  `;
  const queryParams = [map.id];
  return pool.query(queryStr, queryParams)
  .then(res => res.rows);
}
exports.getMapPins = getMapPins;

const getPinDetails = function(mapParams) {
  const params = [];
  let queryString = '';

  // console.log(mapParams);

  //  ====================================================== If we are doing this by pin id
  //  adjust
  if (mapParams.id) {
    params.push(mapParams.id);
    queryString = `
    SELECT *
    FROM pins
    WHERE id = $1;
    `;
  }

  // console.log("pin details query is ", queryString);
  // console.log("parameters sent is ", params);

  return pool.query(queryString, params)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Pin query error", e));
};
exports.getPinDetails = getPinDetails;

// TEST CODE
// getPinDetails({id : 3});


const addPin = function(mapParams) {
  const params = [];
  let queryString = `INSERT INTO pins (`;

  const keys = Object.keys(mapParams);
  for (const key of keys) {
    queryString += key;
    if (keys.indexOf(key) ===  keys.length - 1) {
      queryString +=  `) `;
    } else {
      queryString +=  `, `;
    }
  }
  queryString +=  `VALUES (`;

  for (const key of keys) {
    // check to push correct type to db
    const numRegex = new RegExp("^[1-9]\d*(\.\d+)?$", "gm");
    if (typeof mapParams[key] === 'string' && numRegex.test(mapParams[key])) {
      params.push(Number(mapParams[key]));
    } else {
      params.push(mapParams[key]);
    }

    if (keys.indexOf(key) ===  keys.length - 1) {
      queryString += `$${params.length} ) `;
    } else {
      queryString += `$${params.length}, `;
    }
  }

  queryString += `RETURNING *;`;

  return pool.query(queryString, params)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Pin create error", e));
};
exports.addPin = addPin;

//update pin details
const editPinDetails = function(pin) {
  const copyWithoutId = getObjWithoutId(pin);
  const queryParams = [pin.id];
  let queryStr = `
    UPDATE pins
    SET
  `;
  let counter = 0;
  for (let key in copyWithoutId) {
    let val = copyWithoutId[key];
    queryStr += counter === 0 ? ` ${key} = $${counter + 2} ` : ` ,${key} = $${counter + 2} `;
    queryParams.push(val);
    counter++;
  }

  queryStr +=
  `
    WHERE id = $1
    RETURNING *;
  `;

  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};

exports.editPinDetails = editPinDetails;

//remove pin
const removePin = function(pin) {
  let queryStr = `
    DELETE
    FROM pins
    WHERE id = $1
    RETURNING *;
  `;
  const queryParams = [pin.id];

  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.removePin = removePin;

//get all collaborators of a map
const getMapCollaborators = function(map) {
  let queryStr = `
    SELECT u.*
    FROM
      collaborators c JOIN users u ON c.user_id = u.id
    WHERE
      c.map_id = $1;
  `;
  const queryParams = [map.id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows)
    .catch(e => console.log(e))
};
exports.getMapCollaborators = getMapCollaborators;

//get every user that has collaborated with a user
const getAllUserCollaborators = function(user, limit = 10) {
  let queryStr = `
    SELECT DISTINCT u.*
    FROM collaborators c1
      JOIN collaborators c2 ON c2.map_id = c1.map_id
      JOIN users u ON u.id = c2.user_id
    WHERE
      c1.user_id = $1 AND u.id != $1
    LIMIT $2;
  `;
  const queryParams = [user.id, limit];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows);
};
exports.getAllUserCollaborators = getAllUserCollaborators;

//add new collaborator
const addCollaborator = function(params) {
  let queryStr = `
    INSERT INTO collaborators (map_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const queryParams = [params.map_id, params.user_id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.addCollaborator = addCollaborator;

// delete from collaborators
// this function might need better input parameters:
//i.e. we probably want to remove by mapid and userid?
const removeCollaborator = function(params) {
  let queryStr = `
    DELETE
    FROM collaborators
    WHERE map_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const queryParams = [params.map_id, params.user_id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.removeCollaborator = removeCollaborator;

//add Fav
const addFav = function(params) {
  let queryStr = `
    INSERT INTO favorites (map_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const queryParams = [params.map_id, params.user_id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.addFav = addFav;

//remove Fav
const removeFav = function(params) {
  let queryStr = `
    DELETE
    FROM favorites
    WHERE map_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const queryParams = [params.map_id, params.user_id];
  return pool.query(queryStr, queryParams)
    .then(res => res.rows[0]);
};
exports.removeFav = removeFav;
