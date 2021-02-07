const pool = require('./lib/pool');

const query = function (queryStr, queryParams) {
  return pool.query(queryStr, queryParams)
  .catch(err => console.log(`query error: ${Error(err)}`));
};

const getObjWithoutId = function (obj) {
  const res = {};
  for(let key in obj) {
    if (key !== 'id') {
      res[key] = obj[key];
    }
  }
  return res;
};

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

//--------------------------------------------------------------------------------------------------

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

//update pin details
const editPinDetails = function (pin) {
  const copyWithoutId = getObjWithoutId(pin);
  const queryParams = [pin.id];
  let queryStr = `
    UPDATE pins
    SET
  `

}
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
