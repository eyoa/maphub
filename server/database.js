const pool = require('./lib/pool');

const query = function (queryStr, queryParams) {
  return pool.query(queryStr, queryParams)
  .catch(err => console.log(`query error: ${Error(err)}`));
};

// user queries // ------------------------------------------------------------------------------------
const getUser = function(id, email) {
  let queryStr = `
    SELECT *
    FROM users
    WHERE
  `;
  if (id) {
    queryStr += ` id = ${id};`;
  } else if (email) {
    queryStr += ` email = ${email};`;
  }
  let queryParams = [];
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.getUser = getUser;

const setUser = function(user) {
  const userAttr = ['username', 'email', 'password', 'description', 'profile_img_url'];
  let queryStr = `
    UPDATE users
    SET ${userAttr[0]} = $2, ${userAttr[1]} = $3, ${userAttr[2]} = 4, ${userAttr[3]} = $5, ${userAttr[4]} = $6
    WHERE id = $1;
  `;
  let queryParams = [user.id];
  for (let attr in userAttr) {
    queryParams.push(user[attr]);
  }
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.setUser = setUser;

const addUser = function(user) {
  let queryStr = `
    INSERT INTO users
    ${Object.keys(user)}
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const queryParams = [];
  for (let key of user) {
    queryParams.push(user[key]);
  }
  return query(queryStr, queryParams)
  .then(res => res.rows[0]);
};
exports.addUser = addUser;

//--------------------------------------------------------------------------------------------------

const getMapList = () => {
  return pool.query(
    'SELECT title, description FROM maps;'
    )
  .then(data => {
    console.log("GOT the goods");
    console.log(data.rows);
    return data.rows
  })
  .catch(e => null);
};
exports.getMapList = getMapList;

