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
}

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

