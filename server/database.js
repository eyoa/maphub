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
  console.log("keys array is", keys);

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

  return pool.query(queryString, queryParams)
    .then(data => {
      console.log("GOT the goods");
      console.log(data.rows);
      return data.rows;
    })
    .catch(e => console.log("Map query error", e));
};
exports.getMapList = getMapList;

