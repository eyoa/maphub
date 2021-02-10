const pool = require('./lib/pool');


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

module.exports = {getActiveKeys, getObjWithoutId};
