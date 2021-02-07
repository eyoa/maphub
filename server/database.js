const pool = require('./lib/pool');


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
