
const getActiveKeys = function(params) {
  // get array of keys with actual values
    if (params){
      const keys = Object.keys(params).filter(key =>{
        if (!params[key]) {
          return false;
        }
        return key;
      });
      return keys;
    }
    return [];
}

const getObjWithoutId = function (obj) {
  const res = {};
  for(let key in obj) {
    if (key !== 'id') {
      res[key] = obj[key];
    }
  }
  return res;
};

const query = function (queryStr, queryParams) {
  return pool.query(queryStr, queryParams)
  .catch(err => console.log(`query error: ${Error(err)}`));
};

module.exports = {getActiveKeys, getObjWithoutId, query};
