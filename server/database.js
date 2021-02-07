const pool = require('./lib/pool');
const {
  getActiveKeys,
  getObjWithoutId,
  query
} = require('./qHelpers');


// user queries // ------------------------------------------------------------------------------------
const getUser = function(id, email) {
  const queryParams = [];
  let queryStr = `
    SELECT *
    FROM users
    WHERE
  `;
  if (id) {
    queryStr += ` id = $1;`;
    queryParams.push(id);
  } else if (email) {
    queryStr += ` email = $1;`;
    queryParams.push(email);
  }
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.getUser = getUser;

const setUser = function(user) {
  const copyWithoutId = getObjWithoutId(user);
  const userAttr = ['username', 'email', 'password', 'description', 'profile_img_url'];
  const queryParams = [user.id];

  let queryStr = `
    UPDATE users
    SET
  `;

  let counter = 0;
  for (let key in copyWithoutId) {
    let val = copyWithoutId[key];
    queryStr += counter === 0 ? ` ${key} = $${counter+2} ` : ` ,${key} = $${counter+2} `;
    queryParams.push(val);
    counter++;
  }
  queryStr +=
  `
    WHERE id = $1
    RETURNING *;
  `;

  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.setUser = setUser;

const addUser = function(user) {
  let queryStr = `
    INSERT INTO users (${Object.keys(user)})
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [];
  for (let key in user) {
    queryParams.push(user[key]);
  }
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
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
  SELECT title, description
  FROM maps
  `;

  const keys = getActiveKeys(params);
  // console.log("keys array is", keys);

  if (keys.includes('user_id')) {
    //favorites list
    queryParams.push(params['user_id']);
    queryString += `
    JOIN favorites ON maps.id = favorites.map_id
    WHERE favorites.user_id = $${queryParams.length}
    `;

  } else if (keys.includes('owner_id')) {
    // owned maps list
    queryParams.push(params['owner_id']);
    queryString += `WHERE owner_id = $${queryParams.length}
    `;
  }

  queryString += `;`;

  // console.log("queryString is ", queryString);

  return pool.query(queryString, queryParams)
    .then(data => {
      // console.log("GOT the goods - map list");
      // console.log(data.rows);
      return data.rows;
    })
    .catch(e => console.log("Map query error", e));
};
exports.getMapList = getMapList;

// only allow map detail query based on id
// this might be specific case for getMapList
const getMapDetails = function (id) {
  let queryStr = `
    SELECT *
    FROM maps
    WHERE id = $1;
  `;
  const queryParams = [id];
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.getMapDetails = getMapDetails;

const addMap = function(mapParams) {
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

  // console.log("addMap query is ", queryString);
  // console.log("addMap parameters ", params);

  return pool.query(queryString, params)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Map create error", e));
};
exports.addMap = addMap;

// TEST CODE
// addMap({latitude: 43.653274, longitude: -79.381397, title: 'somewhere', zoom_lv: 8, description : 'This is a testplace totally fake', owner_id : 3});



// update entry in map table
//mapParams is an object with key values pairs matching db
const updateMap = function(mapParams) {
  const updateParams = [];
  let updateString = `UPDATE maps SET `;

  const keys = getActiveKeys(mapParams);
  // console.log(keys);

  for (const key of keys) {
    if (key !== 'id') {
      console.log("==============", key);

      updateParams.push(mapParams[key]);
      updateString += key + ' = ' + `$${updateParams.length}`;

      if (keys.indexOf(key) !==  keys.length - 1) {
        updateString +=  `, `;
      }
    }

  }

  updateParams.push(mapParams['id']);
  updateString += ` WHERE id = $${updateParams.length} `;
  updateString += `RETURNING *;`;

  // console.log("updateMap query is ", updateString);
  // console.log("updateMap parameters ", updateParams);

  return pool.query(updateString, updateParams)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Map update error", e));
};
exports.updateMap = updateMap;

// TEST CODE
// updateMap({id : 2, description : 'This is New York again'});



// remove a map
//mapParams is an object with key values pairs (needs for map id)
const removeMap = function(mapParams) {
  const paramMapid = [];
  let removeQuery = '';
  // to ensure there is a valid condition before sending remove query
  console.log(mapParams.id);

  if (mapParams.id) {
    paramMapid.push(mapParams.id);
    removeQuery = `
    DELETE FROM maps
    WHERE id = $1;
    `;
  }

  console.log("removeMap query is ", removeQuery);
  console.log("map id to remove is ", paramMapid);

  return pool.query(removeQuery, paramMapid)
    .then(data => {
      // =================  Unsure if any data should be returned....
      return " ^_^ ";
    })
    .catch(e => console.log("Map remove error", e));
};
exports.removeMap = removeMap;

// TEST CODE
// removeMap({id : 2 });


// get pin details columns other than longtitude and latitude
//mapParams is an object with key values pairs (needs pin id)
const getPinDetails = function(mapParams) {
  const params = [];
  let queryString = '';

  console.log(mapParams);

  //  ====================================================== If we are doing this by pin id
  //  adjust
  if (mapParams.id) {
    params.push(mapParams.id);
    queryString = `
    SELECT title, description, img_url
    FROM pins
    WHERE id = $1;
    `;
  }

  console.log("pin details query is ", queryString);
  console.log("parameters sent is ", params);

  return pool.query(queryString, params)
    .then(data => {
      console.log(data);
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

  console.log("addPin query is ", queryString);
  console.log("addPin parameters ", params);

  return pool.query(queryString, params)
    .then(data => {
      return data.rows;
    })
    .catch(e => console.log("Pin create error", e));
};
exports.addPin = addPin;

// TEST CODE
// addPin({latitude: 43.653274, longitude: -79.381397, title: 'I am a pin!', img_url: './images/fake_image.png', description : 'This is the best and only spot', map_id : 1});

//update pin details
const editPinDetails = function (pin) {
  const copyWithoutId = getObjWithoutId(pin);
  const queryParams = [pin.id];
  let queryStr = `
    UPDATE pins
    SET
  `
  let counter = 0;
  for (let key in copyWithoutId) {
    let val = copyWithoutId[key];
    queryStr += counter === 0 ? ` ${key} = $${counter+2} ` : ` ,${key} = $${counter+2} `;
    queryParams.push(val);
    counter++;
  }

  queryStr +=
  `
    WHERE id = $1
    RETURNING *;
  `;

  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.editPinDetails = editPinDetails;

//remove pin
const removePin = function (id) {
  let queryStr = `
    DELETE
    FROM pins
    WHERE id = $1
    RETURNING *;
  `;
  const queryParams = [id];
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.removePin = removePin;

//get all collaborators of a map
const getMapCollaborators = function (map_id, limit=10) {
  let queryStr = `
    SELECT u.*
    FROM
      collaborators c JOIN users u ON c.user_id = u.id
    WHERE
      c.map_id = $1
    LIMIT $2;
  `;
  const queryParams = [map_id, limit];
  return query(queryStr, queryParams)
  .then(res => res.rows);
};
exports.getMapCollaborators = getMapCollaborators;

//get every user that has collaborated with a user
const getAllUserCollaborators = function (user_id, limit=10) {
  let queryStr = `
    SELECT DISTINCT u.*
    FROM collaborators c1
      JOIN collaborators c2 ON c2.map_id = c1.map_id
      JOIN users u ON u.id = c2.user_id
    WHERE
      c1.user_id = $1 AND u.id != $1
    LIMIT $2;
  `;
  const queryParams = [user_id, limit];
  return query(queryStr, queryParams)
  .then(res => res.rows);
};
exports.getAllUserCollaborators = getAllUserCollaborators;

//add new collaborator
const addCollaborator = function (map_id, user_id) {
  let queryStr = `
    INSERT INTO collaborators (map_id, user_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const queryParams = [map_id, user_id];
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.addCollaborator = addCollaborator;

// delete from collaborators
// this function might need better input parameters:
//i.e. we probably want to remove by mapid and userid?
const removeCollaborator = function (id) {
  let queryStr = `
    DELETE
    FROM Collaborators
    WHERE id = $1
    RETURNING *;
  `;
  const queryParams = [id];
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.removeCollaborator = removeCollaborator;
