const pool = require('./lib/pool');
const getActiveKeys = require('./qHelpers');


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
